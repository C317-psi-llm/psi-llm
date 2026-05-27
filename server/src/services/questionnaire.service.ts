import db from "../db/knex";
import UserRepository from "../repositories/user.repository";

class QuestionnaireService {
  static async list() {
    return db("questionario").select("*").where({ status: "active" });
  }

  static async getById(id: number) {
    return db("questionario").where({ id_questionario: id }).first();
  }

  static computeLevels(structure: any, answers: any) {
    const result: any = {
      estresse: 0,
      ansiedade: 0,
      burnout: 0,
      depressao: 0,
    };

    // For each section sum answers and normalize to 0-100
    for (const section of structure.sections || []) {
      const key = section.key;
      let sum = 0;
      let maxSum = 0;
      for (const q of section.questions || []) {
        const val = Number(answers[q.id] ?? 0);
        sum += val;
        maxSum += q.max || 4;
      }
      const percent = maxSum > 0 ? Math.round((sum / maxSum) * 100) : 0;
      if (key in result) result[key] = percent;
    }

    return result;
  }

  static classificationFromAverage(avg: number) {
    if (avg >= 75) return "Alto";
    if (avg >= 40) return "Moderado";
    return "Baixo";
  }

  static async saveResponse({
    id_usuario,
    id_questionario,
    answers,
  }: {
    id_usuario: number;
    id_questionario: number;
    answers: any;
  }) {
    const questionario = await this.getById(id_questionario);
    if (!questionario)
      throw { status: 404, message: "Questionário não encontrado" };
    const structure =
      typeof questionario.estrutura_json === "string"
        ? JSON.parse(questionario.estrutura_json)
        : questionario.estrutura_json;
    const levels = this.computeLevels(structure, answers);
    const pontuacao_total = Math.round(
      (levels.estresse + levels.ansiedade + levels.burnout + levels.depressao) /
        4,
    );
    const classificacao_geral = this.classificationFromAverage(pontuacao_total);

    // Use a transaction so insert + user update are atomic and make the
    // handling of `returning` robust across environments.
    const result = await db.transaction(async (trx) => {
      const inserted = await trx("resposta_questionario")
        .insert({
          id_usuario,
          id_questionario,
          respostas_json: JSON.stringify(answers),
          pontuacao_total: pontuacao_total,
          nivel_estresse: levels.estresse,
          nivel_ansiedade: levels.ansiedade,
          nivel_burnout: levels.burnout,
          nivel_depressao: levels.depressao,
          classificacao_geral,
          data_resposta: db.fn.now(),
        })
        .returning("id_resposta_questionario");

      // `inserted` can be an array of objects or values depending on client
      // and knex version; normalize to a single id.
      let id_resposta_questionario: any;
      if (Array.isArray(inserted)) {
        const first = inserted[0];
        id_resposta_questionario =
          first &&
          typeof first === "object" &&
          "id_resposta_questionario" in first
            ? (first as any).id_resposta_questionario
            : first;
      } else {
        id_resposta_questionario = inserted;
      }

      await trx("usuario").where({ id_usuario }).update({ pontuacao_total });

      const row = await trx("resposta_questionario")
        .where({ id_resposta_questionario })
        .first();

      return row;
    });

    return result;
  }

  static async historyByUser(id_usuario: number, days?: number) {
    const query = db("resposta_questionario").where({ id_usuario });

    if (typeof days === "number" && !Number.isNaN(days)) {
      const fromDate = new Date();
      fromDate.setDate(fromDate.getDate() - days + 1);
      query.andWhere("data_resposta", ">=", fromDate.toISOString());
    }

    return query.orderBy("data_resposta", "desc");
  }
}

export default QuestionnaireService;
