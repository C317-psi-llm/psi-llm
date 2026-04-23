import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt";
import UserRepository from "../repositories/user.repository";

export async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith("Bearer "))
      return res.status(401).json({ success: false, message: "Missing token" });
    const token = auth.replace("Bearer ", "");
    const payload: any = verifyAccessToken(token);
    if (!payload || !payload.id_usuario)
      return res.status(401).json({ success: false, message: "Invalid token" });
    const user = await UserRepository.findById(payload.id_usuario);
    if (!user)
      return res
        .status(401)
        .json({ success: false, message: "User not found" });
    // attach user to request
    (req as any).user = user;
    next();
  } catch (err) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid or expired token" });
  }
}
