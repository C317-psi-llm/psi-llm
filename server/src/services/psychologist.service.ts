import config from "../config";
import ConversationsRepository from "../repositories/conversations.repository";
import InsightsRepository, {
  type Origem,
  type Seriedade,
} from "../repositories/insights.repository";
import UserRepository from "../repositories/user.repository";

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

const INSIGHT_PROMPT = [
  "Voce e um assistente que ajuda psicologos a entender conversas entre um funcionario e uma IA de apoio emocional.",
  "Analise a transcricao e gere de 1 a 5 insights curtos e acionaveis em portugues do Brasil.",
  "Responda APENAS com JSON valido, sem markdown, sem texto antes/depois.",
  'Formato exato: {"insights":[{"conteudo":"...","seriedade":"padrao"|"alerta"|"bom"}]}',
  "Use 'alerta' apenas para sinais que merecem atencao clinica imediata; 'bom' para progresso; 'padrao' para o resto.",
].join(" ");

class PsychologistService {
  static async listPatients(psicologoId: number) {
    return UserRepository.listByPsicologo(psicologoId);
  }

  static async getPatient(id_usuario: number, psicologoId: number) {
    const patient = await UserRepository.findAssignedFuncionario(
      id_usuario,
      psicologoId,
    );
    if (!patient) throw { status: 404, message: "Not found" };
    return patient;
  }

  static async listConversations(id_usuario: number, psicologoId: number) {
    await this.getPatient(id_usuario, psicologoId);
    return ConversationsRepository.listByUsuarioOrdered(id_usuario);
  }

  static async getConversation(id_conversa: number, psicologoId: number) {
    const conversation =
      await ConversationsRepository.findConversationById(id_conversa);
    if (!conversation) throw { status: 404, message: "Not found" };

    const patient = await UserRepository.findAssignedFuncionario(
      conversation.id_usuario,
      psicologoId,
    );
    if (!patient) throw { status: 404, message: "Not found" };

    const messages = await ConversationsRepository.listMessages(id_conversa);
    return { conversation, messages };
  }

  static async generateInsightsFromConversation(
    id_conversa: number,
    psicologoId: number,
  ) {
    const { conversation, messages } = await this.getConversation(
      id_conversa,
      psicologoId,
    );

    const transcript = messages
      .map(
        (m: { remetente: string; conteudo: string }) =>
          `${m.remetente === "assistente" ? "assistente" : "usuario"}: ${m.conteudo}`,
      )
      .join("\n");

    const { fromChatMessages } = await getSdk();
    const client = await getClient();
    const result = client.callModel({
      model: config.openRouter.model,
      input: fromChatMessages([
        { role: "user", content: transcript },
      ] as Parameters<typeof fromChatMessages>[0]),
      instructions: INSIGHT_PROMPT,
    });

    let buffer = "";
    for await (const delta of result.getTextStream()) {
      buffer += delta;
    }

    let parsed: { insights?: Array<{ conteudo?: string; seriedade?: string }> };
    try {
      parsed = JSON.parse(buffer);
    } catch {
      const match = buffer.match(/\{[\s\S]*\}/);
      if (!match) throw { status: 502, message: "AI returned no JSON" };
      parsed = JSON.parse(match[0]);
    }

    const allowed = new Set(["padrao", "alerta", "bom"]);
    const rows = (parsed.insights || [])
      .filter(
        (x) =>
          typeof x?.conteudo === "string" &&
          x.conteudo.trim() &&
          allowed.has(x?.seriedade ?? ""),
      )
      .map((x) => ({
        id_usuario: conversation.id_usuario,
        id_psicologo: psicologoId,
        conteudo: x.conteudo!.trim(),
        seriedade: x.seriedade as Seriedade,
        origem: "ia" as Origem,
      }));

    return InsightsRepository.createMany(rows);
  }
}

export default PsychologistService;
