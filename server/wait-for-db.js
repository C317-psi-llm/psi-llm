const { Client } = require("pg");

const config = {
  host: process.env.PGHOST || "db",
  port: parseInt(process.env.PGPORT || "5432", 10),
  user: process.env.PGUSER || "postgres",
  password: process.env.PGPASSWORD || "postgres",
  database: process.env.PGDATABASE || "mentis",
};

async function waitForPostgres() {
  while (true) {
    try {
      const client = new Client(config);
      await client.connect();
      await client.end();
      console.log("Postgres reachable");
      break;
    } catch (err) {
      console.log("Waiting for Postgres...");
      await new Promise((r) => setTimeout(r, 1000));
    }
  }
}

waitForPostgres().catch((e) => {
  console.error(e);
  process.exit(1);
});
