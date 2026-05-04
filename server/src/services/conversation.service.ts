import { Response } from "express";
import config from "../config";
import ConversationsRepository from "../repositories/conversations.repository";

const SYSTEM_PROMPT = [
  "Voce é um assistente de apoio emocional empatico, respeitoso e acolhedor.",
  "Responda em portugues do Brasil de forma breve, clara e humana.",
  "Lembre o usuario, quando apropriado, que voce não substitui ajuda profissional",
  "e que em caso de emergência ou risco imediato ele deve procurar atendimento especializado.",
  "Faça perguntas abertas para entender melhor o contexto antes de sugerir ações.",
].join(" ");

const dynamicImport = new Function("m", "return import(m)") as <T = unknown>(
  m: string,
) => Promise<T>;

let sdkPromise: Promise<typeof import("@openrouter/agent")> | null = null;
function getSdk() {
  if (!sdkPromise) {
    sdkPromise = dynamicImport<typeof import("@openrouter/agent")>(
      "@openrouter/agent",
    );
  }
  return sdkPromise;
}

let clientPromise: Promise<
  InstanceType<typeof import("@openrouter/agent").OpenRouter>
> | null = null;
async function getClient() {
  if (!clientPromise) {
    clientPromise = (async () => {
      const { OpenRouter } = await getSdk();
      return new OpenRouter({ apiKey: config.openRouter.apiKey });
    })();
  }
  return clientPromise;
}

function toChatRole(remetente: string): "user" | "assistant" {
  return remetente === "assistente" ? "assistant" : "user";
}

class ConversationService {
  static async create(id_usuario: number) {
    return ConversationsRepository.createConversation(id_usuario);
  }

  static async getByIdForUser(id: number, id_usuario: number) {
    const data = await ConversationsRepository.findConversationWithMessages(id);
    if (!data) throw { status: 404, message: "Conversation not found" };
    if (data.conversation.id_usuario !== id_usuario)
      throw { status: 403, message: "Forbidden" };
    return data;
  }

  static async handleIncomingMessage(params: {
    id_conversa: number;
    id_usuario: number;
    content: string;
    res: Response;
  }) {
    const { id_conversa, id_usuario, content, res } = params;

    const conversation =
      await ConversationsRepository.findConversationById(id_conversa);
    if (!conversation)
      throw { status: 404, message: "Conversation not found" };
    if (conversation.id_usuario !== id_usuario)
      throw { status: 403, message: "Forbidden" };

    await ConversationsRepository.addMessage({
      id_conversa,
      conteudo: content,
      remetente: "usuario",
    });

    const messages = await ConversationsRepository.listMessages(id_conversa);
    const history = messages.map((m: any) => ({
      role: toChatRole(m.remetente),
      content: m.conteudo,
    }));

    const { fromChatMessages } = await getSdk();
    const client = await getClient();

    const result = client.callModel({
      model: config.openRouter.model,
      input: fromChatMessages(history as any),
      instructions: SYSTEM_PROMPT,
    });

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Accel-Buffering", "no");
    res.flushHeaders?.();

    let aborted = false;
    const onClose = () => {
      aborted = true;
      result.cancel().catch(() => {});
    };
    res.req.on("close", onClose);

    let buffer = "";
    try {
      for await (const delta of result.getTextStream()) {
        if (aborted) break;
        buffer += delta;
        res.write(`data: ${JSON.stringify({ delta })}\n\n`);
      }

      if (!aborted) {
        const saved = await ConversationsRepository.addMessage({
          id_conversa,
          conteudo: buffer,
          remetente: "assistente",
        });
        res.write(`event: done\n`);
        res.write(
          `data: ${JSON.stringify({ id_mensagem: saved?.id_mensagem })}\n\n`,
        );
        res.end();
      } else {
        res.end();
      }
    } catch (err: any) {
      const message = err?.message || "LLM stream error";
      try {
        res.write(`event: error\n`);
        res.write(`data: ${JSON.stringify({ message })}\n\n`);
      } catch {
        // ignore
      }
      res.end();
    } finally {
      res.req.off("close", onClose);
    }
  }
}

export default ConversationService;
