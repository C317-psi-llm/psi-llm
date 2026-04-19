import { pool } from "../../config/db";

export async function aceitarTermos(id_usuario: number) {
  const result = await pool.query(
    `UPDATE usuario
     SET aceitou_lgpd = TRUE, data_aceite = NOW()
     WHERE id_usuario = $1
     RETURNING id_usuario, aceitou_lgpd, data_aceite`,
    [id_usuario],
  );

  if (result.rows.length === 0) {
    throw new Error("Usuário não encontrado.");
  }

  return result.rows[0];
}

export async function statusTermos(id_usuario: number) {
  const result = await pool.query(
    `SELECT aceitou_lgpd, data_aceite FROM usuario WHERE id_usuario = $1`,
    [id_usuario],
  );

  if (result.rows.length === 0) {
    throw new Error("Usuário não encontrado.");
  }

  return result.rows[0];
}
