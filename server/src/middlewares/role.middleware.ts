import { Request, Response, NextFunction } from "express";

export function authorize(...allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    if (!user)
      return res
        .status(401)
        .json({ success: false, message: "Not authenticated" });
    if (!allowedRoles.includes(user.papel))
      return res.status(403).json({ success: false, message: "Forbidden" });
    next();
  };
}
