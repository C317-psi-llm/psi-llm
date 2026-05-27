import db from "../db/knex";

class UserRepository {
  static async findByEmail(email: string) {
    return db("usuario").where({ email }).first();
  }

  static async findById(id: number) {
    return db("usuario").where({ id_usuario: id }).first();
  }

  static async create(user: any) {
    const [id] = await db("usuario").insert(user).returning("id_usuario");
    return this.findById(id);
  }

  static async acceptLgpd(id: number) {
    await db("usuario")
      .where({ id_usuario: id })
      .update({ aceitou_lgpd: true, data_aceite: db.fn.now() });
    return this.findById(id);
  }

  static async updateLastAccess(id: number) {
    await db("usuario")
      .where({ id_usuario: id })
      .update({ ultimo_acesso: db.fn.now() });
  }

  static async updatePontuacaoTotal(id: number, pontuacao_total: number) {
    await db("usuario").where({ id_usuario: id }).update({ pontuacao_total });
  }

  static async listByPsicologo(id_psicologo: number) {
    return db("usuario")
      .where({ id_psicologo, papel: "funcionario" })
      .select("id_usuario", "nome", "email", "status");
  }

  static async findAssignedFuncionario(
    id_usuario: number,
    id_psicologo: number,
  ) {
    return db("usuario")
      .where({ id_usuario, id_psicologo, papel: "funcionario" })
      .first();
  }
}

export default UserRepository;
