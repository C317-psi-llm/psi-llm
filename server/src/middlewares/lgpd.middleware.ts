import { Request, Response, NextFunction } from "express";

export function requireLgpdAccepted(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const user = (req as any).user;
  if (!user) return res.status(401).json({ message: "Unauthenticated" });
  // accept both pt-BR and en properties but prefer PT-BR
  const accepted = user.aceitou_lgpd ?? user.lgpd_accepted ?? false;
  if (!accepted) {
    return res
      .status(403)
      .json({
        message: "LGPD terms must be accepted before using this resource",
      });
  }
  next();
}
