import { Router } from "express";
import {
  createConversation,
  getConversation,
  getUserConversations,
  postMessage,
} from "../../controllers/conversation.controller";
import { authenticate } from "../../middlewares/auth.middleware";
import { requireLgpdAccepted } from "../../middlewares/lgpd.middleware";
import {
  idParamValidator,
  paginationQueryValidator,
  sendMessageValidator,
  userIdParamValidator,
} from "../../validators/conversation.validator";

const router = Router();

router.post("/", authenticate, requireLgpdAccepted, createConversation);
router.get(
  "/user/:id",
  authenticate,
  requireLgpdAccepted,
  userIdParamValidator,
  paginationQueryValidator,
  getUserConversations,
);
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
