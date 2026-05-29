import { Router } from "express";
import authRoutes from "./v1/auth.routes";
import lgpdRoutes from "./v1/lgpd.routes";
import questionnaireRoutes from "./v1/questionnaire.routes";
import conversationRoutes from "./v1/conversation.routes";
import psychologistRoutes from "./v1/psychologist.routes";
import insightsRoutes from "./v1/insights.routes";
import gamificationRoutes from "./v1/gamification.routes";
import managerRoutes from "./v1/manager.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/lgpd", lgpdRoutes);
router.use("/questionnaires", questionnaireRoutes);
router.use("/conversations", conversationRoutes);
router.use("/psychologist", psychologistRoutes);
router.use("/insights", insightsRoutes);
router.use("/gamification", gamificationRoutes);
router.use("/manager", managerRoutes);

export default router;
