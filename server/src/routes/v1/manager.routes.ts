import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware";
import { requireLgpdAccepted } from "../../middlewares/lgpd.middleware";
import { authorize } from "../../middlewares/role.middleware";
import {
  getDashboard,
  listPsychologists,
  listPatients,
  getPatientDetail,
  listUsersByRole,
  getStatistics,
  updateUserStatus,
  deleteUser,
  listAlerts,
  getMentalHealthReport,
  getLGPDStatus,
  getSystemSettings,
  updateSystemSettings,
} from "../../controllers/manager.controller";

const router = Router();

// Middlewares aplicados a todas as rotas
const guards = [authenticate, requireLgpdAccepted, authorize("gestor", "admin")];

// Dashboard e estatísticas
router.get("/dashboard", ...guards, getDashboard);
router.get("/statistics", ...guards, getStatistics);
router.get("/reports/mental-health", ...guards, getMentalHealthReport);

// Gerenciar psicólogos
router.get("/psychologists", ...guards, listPsychologists);

// Gerenciar pacientes
router.get("/patients", ...guards, listPatients);
router.get("/patients/:id", ...guards, getPatientDetail);

// Gerenciar usuários por papel
router.get("/users", ...guards, listUsersByRole);

// Atualizar status e deletar usuário
router.patch("/users/:id/status", ...guards, updateUserStatus);
router.delete("/users/:id", ...guards, deleteUser);

// Alertas, privacidade e configuracoes
router.get("/alerts", ...guards, listAlerts);
router.get("/lgpd", ...guards, getLGPDStatus);
router.get("/settings", ...guards, getSystemSettings);
router.patch("/settings", ...guards, updateSystemSettings);

export default router;
