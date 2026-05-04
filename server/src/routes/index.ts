import { Router } from "express";
import authRoutes from "./v1/auth.routes";
import lgpdRoutes from "./v1/lgpd.routes";
import questionnaireRoutes from "./v1/questionnaire.routes";
import conversationRoutes from "./v1/conversation.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/lgpd", lgpdRoutes);
router.use("/questionnaires", questionnaireRoutes);
router.use("/conversations", conversationRoutes);

export default router;
