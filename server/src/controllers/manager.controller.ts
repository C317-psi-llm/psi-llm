import { Request, Response } from "express";
import ManagerRepository from "../repositories/manager.repository";
import { success, fail } from "../utils/response";

/**
 * GET /api/v1/manager/dashboard
 * Obter estatísticas resumidas do painel administrativo
 */
export async function getDashboard(req: Request, res: Response) {
  try {
    const [stats, checkins, riskDistribution] = await Promise.all([
      ManagerRepository.getDashboardStats(),
      ManagerRepository.getCheckinsStats(),
      ManagerRepository.getRiskDistribution(),
    ]);
    const highRisk = riskDistribution.find((risk) => risk.id === "high");

    res.json(
      success({
        stats: {
          ...stats,
          highRiskPatients: highRisk?.patients ?? stats.highRiskPatients,
        },
        checkins,
        riskDistribution,
      })
    );
  } catch (err: any) {
    res
      .status(err.status || 500)
      .json(fail(err.message || "Error fetching dashboard data"));
  }
}

/**
 * GET /api/v1/manager/psychologists?page=1&limit=10
 * Listar psicólogos com paginação
 */
export async function listPsychologists(req: Request, res: Response) {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Number(req.query.limit) || 10);

    const result = await ManagerRepository.listPsychologists(page, limit);
    res.json(success(result));
  } catch (err: any) {
    res
      .status(err.status || 500)
      .json(fail(err.message || "Error listing psychologists"));
  }
}

/**
 * GET /api/v1/manager/patients?page=1&limit=10
 * Listar pacientes com paginação
 */
export async function listPatients(req: Request, res: Response) {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Number(req.query.limit) || 10);

    const result = await ManagerRepository.listPatients(page, limit);
    res.json(success(result));
  } catch (err: any) {
    res
      .status(err.status || 500)
      .json(fail(err.message || "Error listing patients"));
  }
}

/**
 * GET /api/v1/manager/patients/:id
 * Obter detalhes de um paciente específico
 */
export async function getPatientDetail(req: Request, res: Response) {
  try {
    const patientId = Number(req.params.id);

    if (!patientId) {
      return res.status(400).json(fail("Invalid patient ID"));
    }

    const patient = await ManagerRepository.getPatientDetail(patientId);

    if (!patient) {
      return res.status(404).json(fail("Patient not found"));
    }

    res.json(success(patient));
  } catch (err: any) {
    res
      .status(err.status || 500)
      .json(fail(err.message || "Error fetching patient details"));
  }
}

/**
 * GET /api/v1/manager/users?papel=funcionario&page=1&limit=10
 * Listar usuários por papel
 */
export async function listUsersByRole(req: Request, res: Response) {
  try {
    const papel = String(req.query.papel || "funcionario");
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Number(req.query.limit) || 10);

    // Validar papel
    const validRoles = ["funcionario", "psicologo", "gestor", "admin"];
    if (!validRoles.includes(papel)) {
      return res
        .status(400)
        .json(fail(`Invalid role. Must be one of: ${validRoles.join(", ")}`));
    }

    const result = await ManagerRepository.listUsersByRole(papel, page, limit);
    res.json(success(result));
  } catch (err: any) {
    res
      .status(err.status || 500)
      .json(fail(err.message || "Error listing users"));
  }
}

/**
 * GET /api/v1/manager/statistics
 * Obter distribuição de usuários por papel
 */
export async function getStatistics(req: Request, res: Response) {
  try {
    const roleStats = await ManagerRepository.countUsersByRole();
    const stats = await ManagerRepository.getDashboardStats();

    res.json(
      success({
        dashboard: stats,
        byRole: roleStats,
      })
    );
  } catch (err: any) {
    res
      .status(err.status || 500)
      .json(fail(err.message || "Error fetching statistics"));
  }
}

/**
 * PATCH /api/v1/manager/users/:id/status
 * Atualizar status de um usuário
 */
export async function updateUserStatus(req: Request, res: Response) {
  try {
    const userId = Number(req.params.id);
    const { status } = req.body;

    if (!userId) {
      return res.status(400).json(fail("Invalid user ID"));
    }

    if (!["active", "inactive"].includes(status)) {
      return res
        .status(400)
        .json(fail("Invalid status. Must be 'active' or 'inactive'"));
    }

    await ManagerRepository.updateUserStatus(userId, status);

    res.json(success({ id_usuario: userId, status }));
  } catch (err: any) {
    res
      .status(err.status || 500)
      .json(fail(err.message || "Error updating user status"));
  }
}

/**
 * DELETE /api/v1/manager/users/:id
 * Deletar usuário (soft delete)
 */
export async function deleteUser(req: Request, res: Response) {
  try {
    const userId = Number(req.params.id);

    if (!userId) {
      return res.status(400).json(fail("Invalid user ID"));
    }

    await ManagerRepository.deleteUser(userId);

    res.json(success({ id_usuario: userId, deleted: true }));
  } catch (err: any) {
    res
      .status(err.status || 500)
      .json(fail(err.message || "Error deleting user"));
  }
}

/**
 * GET /api/v1/manager/alerts?page=1&limit=10
 * Listar alertas administrativos
 */
export async function listAlerts(req: Request, res: Response) {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Number(req.query.limit) || 10);

    const result = await ManagerRepository.listAlerts(page, limit);
    res.json(success(result));
  } catch (err: any) {
    res
      .status(err.status || 500)
      .json(fail(err.message || "Error listing alerts"));
  }
}

/**
 * GET /api/v1/manager/reports/mental-health
 * Gerar relatorio agregado de saude mental
 */
export async function getMentalHealthReport(req: Request, res: Response) {
  try {
    const report = await ManagerRepository.generateMentalHealthReport();
    res.json(success(report));
  } catch (err: any) {
    res
      .status(err.status || 500)
      .json(fail(err.message || "Error generating report"));
  }
}

/**
 * GET /api/v1/manager/lgpd?page=1&limit=10
 * Obter status de aceite LGPD
 */
export async function getLGPDStatus(req: Request, res: Response) {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Number(req.query.limit) || 10);

    const result = await ManagerRepository.getLGPDStatus(page, limit);
    res.json(success(result));
  } catch (err: any) {
    res
      .status(err.status || 500)
      .json(fail(err.message || "Error fetching LGPD status"));
  }
}

/**
 * GET /api/v1/manager/settings
 * Obter configuracoes do sistema
 */
export async function getSystemSettings(req: Request, res: Response) {
  try {
    const settings = await ManagerRepository.getSystemSettings();
    res.json(success(settings));
  } catch (err: any) {
    res
      .status(err.status || 500)
      .json(fail(err.message || "Error fetching settings"));
  }
}

/**
 * PATCH /api/v1/manager/settings
 * Atualizar configuracoes do sistema
 */
export async function updateSystemSettings(req: Request, res: Response) {
  try {
    const result = await ManagerRepository.updateSystemSettings(req.body);
    res.json(success(result));
  } catch (err: any) {
    res
      .status(err.status || 500)
      .json(fail(err.message || "Error updating settings"));
  }
}
