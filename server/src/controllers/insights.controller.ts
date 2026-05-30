import { Request, Response } from "express";
import InsightsService from "../services/insights.service";
import { success, fail } from "../utils/response";

export async function listInsights(req: Request, res: Response) {
  try {
    const psicologoId = (req as any).user.id_usuario;
    const id_usuario = Number(req.query.id_usuario);
    const rows = await InsightsService.list(id_usuario, psicologoId);
    res.json(success(rows));
  } catch (err: any) {
    res
      .status(err.status || 500)
      .json(fail(err.message || "Error listing insights"));
  }
}

export async function listMyInsights(req: Request, res: Response) {
  try {
    const userId = (req as any).user.id_usuario;
    const rows = await InsightsService.listForPatient(userId);

    res.json(success(rows));
  } catch (err: any) {
    res
      .status(err.status || 500)
      .json(fail(err.message || "Error listing patient insights"));
  }
}

export async function createInsight(req: Request, res: Response) {
  try {
    const psicologoId = (req as any).user.id_usuario;
    const row = await InsightsService.create(req.body, psicologoId);
    res.status(201).json(success(row));
  } catch (err: any) {
    res
      .status(err.status || 500)
      .json(fail(err.message || "Error creating insight"));
  }
}

export async function updateInsight(req: Request, res: Response) {
  try {
    const psicologoId = (req as any).user.id_usuario;
    const row = await InsightsService.update(
      Number(req.params.id),
      req.body,
      psicologoId,
    );
    res.json(success(row));
  } catch (err: any) {
    res
      .status(err.status || 500)
      .json(fail(err.message || "Error updating insight"));
  }
}

export async function deleteInsight(req: Request, res: Response) {
  try {
    const psicologoId = (req as any).user.id_usuario;
    await InsightsService.remove(Number(req.params.id), psicologoId);
    res.json(success({ deleted: true }));
  } catch (err: any) {
    res
      .status(err.status || 500)
      .json(fail(err.message || "Error deleting insight"));
  }
}
