import { query } from "../config/db";

export async function listAll() {
  const res = await query(
    `SELECT * FROM questionario ORDER BY created_at DESC`,
  );
  return res.rows;
}

export async function insertResponse({
  usuario_id,
  questionario_id,
  answers,
  stress_level,
  anxiety_level,
  burnout_level,
  depression_level,
}: any) {
  const res = await query(
    `INSERT INTO resposta_questionario (usuario_id, questionario_id, answers, stress_level, anxiety_level, burnout_level, depression_level) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
    [
      usuario_id,
      questionario_id,
      answers,
      stress_level,
      anxiety_level,
      burnout_level,
      depression_level,
    ],
  );
  return res.rows[0];
}

export async function historyByUser(usuario_id: string) {
  const res = await query(
    `SELECT * FROM resposta_questionario WHERE usuario_id = $1 ORDER BY created_at DESC`,
    [usuario_id],
  );
  return res.rows;
}
