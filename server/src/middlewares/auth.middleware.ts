import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface JwtPayload {
  id_usuario: number;
  papel: string;
  id_empresa: number;
}

export function authenticate(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({ message: "Token não fornecido." });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET as jwt.Secret,
    ) as any;
    req.user = payload as JwtPayload & { aceitou_lgpd?: boolean };
    next();
  } catch {
    res.status(401).json({ message: "Token inválido ou expirado." });
  }
}
