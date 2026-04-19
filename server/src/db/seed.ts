import { pool } from "../config/db";
import { hashPassword } from "../utils/hash";

async function seed() {
  try {
    const client = await pool.connect();
    await client.query("BEGIN");

    const { rows } = await client.query(
      `INSERT INTO empresa (nome, cnpj, email_contato) VALUES ($1,$2,$3) RETURNING *`,
      ["Mentis Tech", "00.000.000/0000-00", "contato@mentis.test"],
    );
    const empresa = rows[0];

    const adminPw = await hashPassword("admin123");
    const userPw = await hashPassword("password123");

    await client.query(
      `INSERT INTO usuario (id_empresa, nome, email, senha_hash, papel, aceitou_lgpd) VALUES ($1,$2,$3,$4,$5,$6)`,
      [
        empresa.id_empresa,
        "Admin",
        "admin@mentis.test",
        adminPw,
        "admin",
        true,
      ],
    );

    await client.query(
      `INSERT INTO usuario (id_empresa, nome, email, senha_hash, papel, aceitou_lgpd) VALUES ($1,$2,$3,$4,$5,$6)`,
      [
        empresa.id_empresa,
        "Joao Funcionario",
        "funcionario@mentis.test",
        userPw,
        "funcionario",
        false,
      ],
    );

    // sample questionnaire for testing
    await client.query(
      `INSERT INTO questionario (titulo, descricao, estrutura_json) VALUES ($1,$2,$3)`,
      [
        "Bem-estar inicial",
        "Questionário inicial para avaliar níveis de estresse/ansiedade/burnout/depressão",
        JSON.stringify([
          { id: "q1", tema: "estresse" },
          { id: "q2", tema: "ansiedade" },
          { id: "q3", tema: "burnout" },
          { id: "q4", tema: "depressao" },
        ]),
      ],
    );

    await client.query("COMMIT");
    console.log("Seed complete");
  } catch (err) {
    console.error("Seed failed", err);
    await pool.query("ROLLBACK");
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

if (require.main === module) seed();
