import { Request, Response } from "express";
import GamificationService from "../services/gamification.service";
import { success, fail } from "../utils/response";

export async function getGamification(req: Request, res: Response) {
  try {
    const user = (req as any).user;
    const data = await GamificationService.getUserGamification(user.id_usuario);
    res.json(success(data));
  } catch (err: any) {
    res
      .status(err.status || 500)
      .json(fail(err.message || "Error fetching gamification data"));
  }
}
