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
