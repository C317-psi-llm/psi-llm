import { Request, Response } from "express";
import { aceitarTermos, statusTermos } from "./lgpd.service";

export async function aceitar(req: Request, res: Response): Promise<void> {
  try {
    const id_usuario = req.user!.id_usuario;
    const resultado = await aceitarTermos(id_usuario);
    res
      .status(200)
      .json({ message: "Termos aceitos com sucesso.", ...resultado });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
}

export async function status(req: Request, res: Response): Promise<void> {
  try {
    const id_usuario = req.user!.id_usuario;
    const resultado = await statusTermos(id_usuario);
    res.status(200).json(resultado);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
}
