import db from "../db/knex";

class RefreshTokenRepository {
  static async create(record: any) {
    const [created] = await db("refresh_token").insert(record).returning("*");

    return created;
  }

  static async findByHash(hash: string) {
    return db("refresh_token").where({ token_hash: hash }).first();
  }

  static async revoke(id: number) {
    await db("refresh_token").where({ id }).update({ revoked: true });
  }

  static async revokeByUser(userId: number) {
    await db("refresh_token")
      .where({ id_usuario: userId })
      .update({ revoked: true });
  }
}

export default RefreshTokenRepository;
