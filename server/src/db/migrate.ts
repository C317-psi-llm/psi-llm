import fs from "fs";
import path from "path";
import { pool } from "../config/db";

const MIGRATIONS_DIR = path.join(__dirname, "..", "..", "db", "migrations");

export async function runMigrations() {
  await ensureMigrationsTable();
  const files = fs
    .readdirSync(MIGRATIONS_DIR)
    .filter((f) => f.endsWith(".sql"))
    .sort();
  for (const file of files) {
    const name = file;
    const already = await pool.query(
      "SELECT 1 FROM migrations WHERE name = $1",
      [name],
    );
    if ((already.rowCount ?? 0) > 0) continue;
    const sql = fs.readFileSync(path.join(MIGRATIONS_DIR, file), "utf8");
    console.log("Running migration", file);
    try {
      await pool.query("BEGIN");
      await pool.query(sql);
      await pool.query("INSERT INTO migrations (name) VALUES ($1)", [name]);
      await pool.query("COMMIT");
    } catch (err) {
      await pool.query("ROLLBACK");
      console.error("Migration failed:", file, err);
      throw err;
    }
  }
}

async function ensureMigrationsTable() {
  await pool.query(
    `CREATE TABLE IF NOT EXISTS migrations (id serial primary key, name text not null unique, run_on timestamptz not null default now())`,
  );
}

if (require.main === module) {
  runMigrations()
    .then(() => {
      console.log("Migrations complete");
      process.exit(0);
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
