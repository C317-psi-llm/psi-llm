import { Router } from "express";
import { login, refresh, logout, me } from "../../controllers/auth.controller";
import { authenticate } from "../../middlewares/auth.middleware";
import { loginValidator } from "../../validators/auth.validator";

const router = Router();

router.post("/login", loginValidator, login);
router.post("/refresh", refresh);
router.post("/logout", logout);
router.get("/me", authenticate, me);

export default router;
