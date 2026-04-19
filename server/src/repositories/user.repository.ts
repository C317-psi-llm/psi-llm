import { pool } from "../config/db";

export async function createUser({
  nome,
  email,
  senha_hash,
  papel,
  id_empresa,
}: any) {
  const res = await pool.query(
    `INSERT INTO usuario (id_empresa, nome, email, senha_hash, papel) VALUES ($1,$2,$3,$4,$5) RETURNING id_usuario, nome, email, papel, aceitou_lgpd`,
    [id_empresa, nome, email, senha_hash, papel],
  );
  return res.rows[0];
}

export async function findByEmail(email: string) {
  const res = await pool.query(
    `SELECT id_usuario, id_empresa, nome, email, senha_hash, papel, aceitou_lgpd FROM usuario WHERE email = $1`,
    [email],
  );
  return res.rows[0];
}

export async function findById(id: string) {
  const res = await pool.query(
    `SELECT id_usuario, id_empresa, nome, email, senha_hash, papel, aceitou_lgpd FROM usuario WHERE id_usuario = $1`,
    [id],
  );
  return res.rows[0];
}

export async function setLgpdAccepted(userId: string) {
  const res = await pool.query(
    `UPDATE usuario SET aceitou_lgpd = true, data_aceite = now() WHERE id_usuario = $1 RETURNING id_usuario, aceitou_lgpd, data_aceite`,
    [userId],
  );
  return res.rows[0];
}
