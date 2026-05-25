import InsightsRepository, {
  type Seriedade,
} from "../repositories/insights.repository";
import UserRepository from "../repositories/user.repository";

class InsightsService {
  private static async assertAssigned(
    id_usuario: number,
    psicologoId: number,
  ) {
    const patient = await UserRepository.findAssignedFuncionario(
      id_usuario,
      psicologoId,
    );
    if (!patient) throw { status: 404, message: "Not found" };
    return patient;
  }

  static async list(id_usuario: number, psicologoId: number) {
    await this.assertAssigned(id_usuario, psicologoId);
    return InsightsRepository.listByUsuario(id_usuario);
  }

  static async create(
    params: {
      id_usuario: number;
      conteudo: string;
      seriedade: Seriedade;
    },
    psicologoId: number,
  ) {
    await this.assertAssigned(params.id_usuario, psicologoId);
    return InsightsRepository.create({
      id_usuario: params.id_usuario,
      id_psicologo: psicologoId,
      conteudo: params.conteudo,
      seriedade: params.seriedade,
      origem: "manual",
    });
  }

  static async update(
    id_insight: number,
    patch: { conteudo?: string; seriedade?: Seriedade },
    psicologoId: number,
  ) {
    const insight = await InsightsRepository.findById(id_insight);
    if (!insight) throw { status: 404, message: "Not found" };
    await this.assertAssigned(insight.id_usuario, psicologoId);
    return InsightsRepository.update(id_insight, patch);
  }

  static async remove(id_insight: number, psicologoId: number) {
    const insight = await InsightsRepository.findById(id_insight);
    if (!insight) throw { status: 404, message: "Not found" };
    await this.assertAssigned(insight.id_usuario, psicologoId);
    await InsightsRepository.delete(id_insight);
  }
}

export default InsightsService;
