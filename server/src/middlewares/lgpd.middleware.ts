import { Request, Response, NextFunction } from "express";

export function requireLgpdAccepted(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const user = (req as any).user;
  if (!user)
    return res
      .status(401)
      .json({ success: false, message: "Not authenticated" });
  if (!user.aceitou_lgpd)
    return res
      .status(403)
      .json({ success: false, message: "LGPD terms must be accepted" });
  next();
}
