import db from "../db/knex";

export type Remetente = "usuario" | "assistente";

class ConversationsRepository {
  static async createConversation(id_usuario: number) {
    const [id] = await db("conversa_ia")
      .insert({
        id_usuario,
        status: "active",
        data_inicio: db.fn.now(),
      })
      .returning("id_conversa");
    const id_conversa = typeof id === "object" ? id.id_conversa : id;
    return this.findConversationById(id_conversa);
  }

  static async findConversationById(id: number) {
    return db("conversa_ia").where({ id_conversa: id }).first();
  }

  static async listByUser(id_usuario: number, page: number, limit: number) {
    const offset = (page - 1) * limit;
    const items = await db("conversa_ia")
      .where({ id_usuario })
      .orderBy("data_inicio", "desc")
      .limit(limit)
      .offset(offset);
    const [{ count }] = await db("conversa_ia")
      .where({ id_usuario })
      .count<{ count: string }[]>("* as count");
    return { items, page, limit, total: Number(count) };
  }

  static async findConversationWithMessages(id: number) {
    const conversation = await this.findConversationById(id);
    if (!conversation) return null;
    const messages = await this.listMessages(id);
    return { conversation, messages };
  }

  static async listMessages(id_conversa: number) {
    return db("mensagem")
      .where({ id_conversa })
      .orderBy("data_envio", "asc");
  }

  static async addMessage(params: {
    id_conversa: number;
    conteudo: string;
    remetente: Remetente;
  }) {
    const [id] = await db("mensagem")
      .insert({
        id_conversa: params.id_conversa,
        conteudo: params.conteudo,
        remetente: params.remetente,
        data_envio: db.fn.now(),
      })
      .returning("id_mensagem");
    const id_mensagem = typeof id === "object" ? id.id_mensagem : id;
    return db("mensagem").where({ id_mensagem }).first();
  }
}

export default ConversationsRepository;
