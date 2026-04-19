import { Request, Response, NextFunction } from "express";
import { loginService, registerService } from "./auth.service";

export async function login(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { email } = req.body;
    // accept either 'senha' (pt-BR) or 'password' (en)
    const senha = req.body.senha ?? req.body.password;

    if (!email || !senha) {
      res.status(400).json({ message: "E-mail e senha são obrigatórios." });
      return;
    }

    const result = await loginService(email, senha);
    res.status(200).json(result);
  } catch (err: any) {
    next(err);
  }
}

export async function register(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    // accept both pt-BR and en keys for onboarding ease
    const id_empresa = req.body.id_empresa ?? req.body.empresa_id;
    const nome = req.body.nome ?? req.body.name;
    const email = req.body.email;
    const senha = req.body.senha ?? req.body.password;
    const papel = req.body.papel ?? req.body.role;

    const papeis = ["funcionario", "psicologo", "gestor", "admin"];
    if (!papeis.includes(papel)) {
      res.status(400).json({ message: "Papel inválido." });
      return;
    }

    const novoUsuario = await registerService({
      id_empresa,
      nome,
      email,
      senha,
      papel,
    });
    res.status(201).json(novoUsuario);
  } catch (err: any) {
    next(err);
  }
}

export async function me(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const user = (req as any).user;
    res.status(200).json({ user });
  } catch (err: any) {
    next(err);
  }
}
