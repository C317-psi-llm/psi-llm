import db from "../db/knex";

export type Seriedade = "padrao" | "alerta" | "bom";
export type Origem = "manual" | "ia";

class InsightsRepository {
  static async listByUsuario(id_usuario: number) {
    return db("insights").where({ id_usuario }).orderBy("criado_em", "desc");
  }

  static async findById(id_insight: number) {
    return db("insights").where({ id_insight }).first();
  }

  static async create(row: {
    id_usuario: number;
    id_psicologo: number | null;
    conteudo: string;
    seriedade: Seriedade;
    origem: Origem;
  }) {
    const [id] = await db("insights")
      .insert({ ...row, criado_em: db.fn.now(), modificado_em: db.fn.now() })
      .returning("id_insight");
    const id_insight = typeof id === "object" ? id.id_insight : id;
    return this.findById(id_insight);
  }

  static async createMany(
    rows: Array<{
      id_usuario: number;
      id_psicologo: number | null;
      conteudo: string;
      seriedade: Seriedade;
      origem: Origem;
    }>,
  ) {
    const created = [];
    for (const r of rows) {
      created.push(await this.create(r));
    }
    return created;
  }

  static async update(
    id_insight: number,
    patch: { conteudo?: string; seriedade?: Seriedade },
  ) {
    await db("insights")
      .where({ id_insight })
      .update({ ...patch, modificado_em: db.fn.now() });
    return this.findById(id_insight);
  }

  static async delete(id_insight: number) {
    await db("insights").where({ id_insight }).del();
  }
}

export default InsightsRepository;
