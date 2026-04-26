import { Router } from "express";
import { status, accept } from "../../controllers/lgpd.controller";
import { authenticate } from "../../middlewares/auth.middleware";

const router = Router();

router.get("/status", authenticate, status);
router.post("/accept", authenticate, accept);

export default router;
