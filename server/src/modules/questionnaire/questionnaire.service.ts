import { pool } from "../../config/db";

export async function getQuestionario(id_questionario: number) {
  const result = await pool.query(
    `SELECT id_questionario, titulo, descricao, estrutura_json
     FROM questionario
     WHERE id_questionario = $1 AND status = 'ativo'`,
    [id_questionario],
  );

  if (result.rows.length === 0) {
    throw new Error("Questionário não encontrado ou inativo.");
  }

  return result.rows[0];
}

export async function listarQuestionarios() {
  const result = await pool.query(
    `SELECT id_questionario, titulo, descricao
     FROM questionario WHERE status = 'ativo'
     ORDER BY data_criacao DESC`,
  );
  return result.rows;
}

// --------------------------------------------------------
// Lógica de pontuação:
// Cada tema tem N perguntas com valores de 1 a 5.
// Calculamos a média por tema e mapeamos para nível 0-4:
//   1.0 – 1.8 → 0 (Nenhum)
//   1.8 – 2.6 → 1 (Leve)
//   2.6 – 3.4 → 2 (Moderado)
//   3.4 – 4.2 → 3 (Alto)
//   4.2 – 5.0 → 4 (Severo)
// --------------------------------------------------------
function calcularNivel(media: number): number {
  if (media <= 1.8) return 0;
  if (media <= 2.6) return 1;
  if (media <= 3.4) return 2;
  if (media <= 4.2) return 3;
  return 4;
}

function classificacaoGeral(niveis: number[]): string {
  const max = Math.max(...niveis);
  const labels = ["nenhum", "leve", "moderado", "alto", "severo"];
  return labels[max];
}

interface Pergunta {
  id: string;
  tema: "estresse" | "ansiedade" | "burnout" | "depressao";
}

interface RespostaInput {
  [perguntaId: string]: number; // 1 a 5
}

export async function responderQuestionario(
  id_usuario: number,
  id_questionario: number,
  respostas: RespostaInput,
) {
  const qResult = await pool.query(
    `SELECT estrutura_json FROM questionario WHERE id_questionario = $1 AND status = 'ativo'`,
    [id_questionario],
  );

  if (qResult.rows.length === 0) {
    throw new Error("Questionário não encontrado ou inativo.");
  }

  const perguntas: Pergunta[] = qResult.rows[0].estrutura_json;

  const idsEsperados = perguntas.map((p) => p.id);
  const idsRecebidos = Object.keys(respostas);
  const faltando = idsEsperados.filter((id) => !idsRecebidos.includes(id));

  if (faltando.length > 0) {
    throw new Error(`Perguntas sem resposta: ${faltando.join(", ")}`);
  }

  const temas: Record<string, number[]> = {
    estresse: [],
    ansiedade: [],
    burnout: [],
    depressao: [],
  };

  for (const pergunta of perguntas) {
    const valor = respostas[pergunta.id];
    if (valor < 1 || valor > 5) {
      throw new Error(
        `Valor inválido para pergunta ${pergunta.id}. Deve ser entre 1 e 5.`,
      );
    }
    temas[pergunta.tema].push(valor);
  }

  const media = (arr: number[]) =>
    arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;

  const nivel_estresse = calcularNivel(media(temas.estresse));
  const nivel_ansiedade = calcularNivel(media(temas.ansiedade));
  const nivel_burnout = calcularNivel(media(temas.burnout));
  const nivel_depressao = calcularNivel(media(temas.depressao));

  const pontuacao_total = parseFloat(
    media([
      ...temas.estresse,
      ...temas.ansiedade,
      ...temas.burnout,
      ...temas.depressao,
    ]).toFixed(2),
  );

  const classif = classificacaoGeral([
    nivel_estresse,
    nivel_ansiedade,
    nivel_burnout,
    nivel_depressao,
  ]);

  const result = await pool.query(
    `INSERT INTO resposta_questionario
       (id_usuario, id_questionario, respostas_json, pontuacao_total,
        nivel_estresse, nivel_ansiedade, nivel_burnout, nivel_depressao, classificacao_geral)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     RETURNING *`,
    [
      id_usuario,
      id_questionario,
      JSON.stringify(respostas),
      pontuacao_total,
      nivel_estresse,
      nivel_ansiedade,
      nivel_burnout,
      nivel_depressao,
      classif,
    ],
  );

  await pool.query(
    `UPDATE usuario SET pontuacao_total = COALESCE(pontuacao_total, 0) + 10 WHERE id_usuario = $1`,
    [id_usuario],
  );

  return result.rows[0];
}

export async function historicoRespostas(id_usuario: number) {
  const result = await pool.query(
    `SELECT rq.id_resposta_questionario, q.titulo, rq.pontuacao_total,
            rq.nivel_estresse, rq.nivel_ansiedade, rq.nivel_burnout, rq.nivel_depressao,
            rq.classificacao_geral, rq.data_resposta
     FROM resposta_questionario rq
     JOIN questionario q ON q.id_questionario = rq.id_questionario
     WHERE rq.id_usuario = $1
     ORDER BY rq.data_resposta DESC`,
    [id_usuario],
  );
  return result.rows;
}
