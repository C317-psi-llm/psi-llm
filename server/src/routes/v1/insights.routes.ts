import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware";
import { requireLgpdAccepted } from "../../middlewares/lgpd.middleware";
import { authorize } from "../../middlewares/role.middleware";
import {
  createInsight,
  deleteInsight,
  listInsights,
  updateInsight,
} from "../../controllers/insights.controller";
import {
  createInsightValidator,
  idParamValidator,
  listInsightsQueryValidator,
  updateInsightValidator,
} from "../../validators/insights.validator";

const router = Router();
const guards = [authenticate, requireLgpdAccepted, authorize("psicologo")];

router.get("/", ...guards, listInsightsQueryValidator, listInsights);
router.post("/", ...guards, createInsightValidator, createInsight);
router.put("/:id", ...guards, updateInsightValidator, updateInsight);
router.delete("/:id", ...guards, idParamValidator, deleteInsight);

export default router;
