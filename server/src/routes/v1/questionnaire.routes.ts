import { Router } from "express";
import {
  listQuestionnaires,
  getQuestionnaire,
  submitResponse,
  history,
} from "../../controllers/questionnaire.controller";
import { authenticate } from "../../middlewares/auth.middleware";
import { requireLgpdAccepted } from "../../middlewares/lgpd.middleware";
import { authorize } from "../../middlewares/role.middleware";
import { submitResponseValidator } from "../../validators/questionnaire.validator";

const router = Router();

router.get("/", authenticate, listQuestionnaires);
router.get("/:id", authenticate, getQuestionnaire);
router.post(
  "/:id/response",
  authenticate,
  requireLgpdAccepted,
  authorize("funcionario"),
  submitResponseValidator,
  submitResponse,
);
router.get("/responses/history", authenticate, requireLgpdAccepted, history);

export default router;
