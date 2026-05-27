import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware";
import { requireLgpdAccepted } from "../../middlewares/lgpd.middleware";
import { getGamification } from "../../controllers/gamification.controller";

const router = Router();

router.get("/me", authenticate, requireLgpdAccepted, getGamification);

export default router;
