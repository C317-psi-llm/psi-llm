import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware";
import { requireLgpdAccepted } from "../../middlewares/lgpd.middleware";
import { authorize } from "../../middlewares/role.middleware";
import {
  generateInsights,
  getConversation,
  getPatient,
  listPatientConversations,
  listPatients,
} from "../../controllers/psychologist.controller";
import {
  idParamValidator,
  userIdParamValidator,
} from "../../validators/conversation.validator";

const router = Router();
const guards = [authenticate, requireLgpdAccepted, authorize("psicologo")];

router.get("/patients", ...guards, listPatients);
router.get("/patients/:id", ...guards, userIdParamValidator, getPatient);
router.get(
  "/patients/:id/conversations",
  ...guards,
  userIdParamValidator,
  listPatientConversations,
);
router.get("/conversations/:id", ...guards, idParamValidator, getConversation);
router.post(
  "/conversations/:id/generate-insights",
  ...guards,
  idParamValidator,
  generateInsights,
);

export default router;
