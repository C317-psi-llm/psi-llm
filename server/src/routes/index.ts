import { Router } from "express";
import authRoutes from "./v1/auth.routes";
import lgpdRoutes from "./v1/lgpd.routes";
import questionnaireRoutes from "./v1/questionnaire.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/lgpd", lgpdRoutes);
router.use("/questionnaires", questionnaireRoutes);

export default router;
