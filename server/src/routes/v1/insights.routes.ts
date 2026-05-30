import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware";
import { requireLgpdAccepted } from "../../middlewares/lgpd.middleware";
import { authorize } from "../../middlewares/role.middleware";
import {
  createInsight,
  deleteInsight,
  listInsights,
  listMyInsights,
  updateInsight,
} from "../../controllers/insights.controller";
import {
  createInsightValidator,
  idParamValidator,
  listInsightsQueryValidator,
  updateInsightValidator,
} from "../../validators/insights.validator";

const router = Router();
const psychologistGuards = [
  authenticate,
  requireLgpdAccepted,
  authorize("psicologo"),
];

const patientGuards = [
  authenticate,
  requireLgpdAccepted,
  authorize("funcionario"),
];

router.get("/me", ...patientGuards, listMyInsights);

router.get("/", ...psychologistGuards, listInsightsQueryValidator, listInsights);
router.post("/", ...psychologistGuards, createInsightValidator, createInsight);
router.put("/:id", ...psychologistGuards, updateInsightValidator, updateInsight);
router.delete("/:id", ...psychologistGuards, idParamValidator, deleteInsight);

export default router;
