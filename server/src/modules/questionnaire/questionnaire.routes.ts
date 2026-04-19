import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware";
import { authorize } from "../../middlewares/rbac.middleware";
import {
  listar,
  buscar,
  responder,
  historico,
} from "./questionnaire.controller";

const router = Router();

router.use(authenticate);

router.get("/", listar);
router.get("/historico", historico);
router.get("/:id", buscar);
router.post("/:id/responder", authorize("funcionario"), responder);

export default router;
