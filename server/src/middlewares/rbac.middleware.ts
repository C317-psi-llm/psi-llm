import { Request, Response, NextFunction } from "express";

export function authorize(allowedRoles: string[] | string) {
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    if (!user) return res.status(401).json({ message: "Unauthenticated" });
    const userRole = user.papel ?? user.role;
    if (!roles.includes(userRole))
      return res.status(403).json({ message: "Forbidden" });
    next();
  };
}
