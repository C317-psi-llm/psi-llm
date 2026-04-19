import app from "./app";
import { pool } from "./config/db";

const PORT = process.env.PORT || 3001;

async function start() {
  try {
    await pool.query("SELECT 1");
    console.log("Conectado ao PostgreSQL");
    app.listen(PORT, () => {
      console.log(`Servidor rodando em http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Falha ao conectar ao banco:", err);
    process.exit(1);
  }
}

start();
