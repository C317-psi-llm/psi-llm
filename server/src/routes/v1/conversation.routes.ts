import { Router } from "express";
import {
  createConversation,
  getConversation,
  postMessage,
} from "../../controllers/conversation.controller";
import { authenticate } from "../../middlewares/auth.middleware";
import { requireLgpdAccepted } from "../../middlewares/lgpd.middleware";
import {
  idParamValidator,
  sendMessageValidator,
} from "../../validators/conversation.validator";

const router = Router();

router.post("/", authenticate, requireLgpdAccepted, createConversation);
router.get(
  "/:id",
  authenticate,
  requireLgpdAccepted,
  idParamValidator,
  getConversation,
);
router.post(
  "/:id/messages",
  authenticate,
  requireLgpdAccepted,
  sendMessageValidator,
  postMessage,
);

export default router;
