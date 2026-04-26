import { Request, Response } from "express";
import UserRepository from "../repositories/user.repository";
import { success, fail } from "../utils/response";

export async function status(req: Request, res: Response) {
  try {
    const user = (req as any).user;
    res.json(
      success({
        aceitou_lgpd: user.aceitou_lgpd,
        data_aceite: user.data_aceite,
      }),
    );
  } catch (err: any) {
    res
      .status(err.status || 500)
      .json(fail(err.message || "Error fetching LGPD status"));
  }
}

export async function accept(req: Request, res: Response) {
  try {
    const user = (req as any).user;
    const updated = await UserRepository.acceptLgpd(user.id_usuario);
    res.json(
      success({
        aceitou_lgpd: updated.aceitou_lgpd,
        data_aceite: updated.data_aceite,
      }),
    );
  } catch (err: any) {
    res
      .status(err.status || 500)
      .json(fail(err.message || "Error accepting LGPD"));
  }
}
