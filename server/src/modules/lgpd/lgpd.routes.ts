import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware";
import { aceitar, status } from "./lgpd.controller";

const router = Router();

router.use(authenticate);

router.post("/aceitar", aceitar);
router.get("/status", status);

export default router;
