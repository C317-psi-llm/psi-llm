import { Request, Response } from "express";
import PsychologistService from "../services/psychologist.service";
import { success, fail } from "../utils/response";

export async function listPatients(req: Request, res: Response) {
  try {
    const psicologoId = (req as any).user.id_usuario;
    const patients = await PsychologistService.listPatients(psicologoId);
    res.json(success(patients));
  } catch (err: any) {
    res
      .status(err.status || 500)
      .json(fail(err.message || "Error listing patients"));
  }
}

export async function getPatient(req: Request, res: Response) {
  try {
    const psicologoId = (req as any).user.id_usuario;
    const patient = await PsychologistService.getPatient(
      Number(req.params.id),
      psicologoId,
    );
    res.json(success(patient));
  } catch (err: any) {
    res
      .status(err.status || 500)
      .json(fail(err.message || "Error fetching patient"));
  }
}

export async function listPatientConversations(req: Request, res: Response) {
  try {
    const psicologoId = (req as any).user.id_usuario;
    const conversations = await PsychologistService.listConversations(
      Number(req.params.id),
      psicologoId,
    );
    res.json(success(conversations));
  } catch (err: any) {
    res
      .status(err.status || 500)
      .json(fail(err.message || "Error listing conversations"));
  }
}

export async function getConversation(req: Request, res: Response) {
  try {
    const psicologoId = (req as any).user.id_usuario;
    const data = await PsychologistService.getConversation(
      Number(req.params.id),
      psicologoId,
    );
    res.json(success(data));
  } catch (err: any) {
    res
      .status(err.status || 500)
      .json(fail(err.message || "Error fetching conversation"));
  }
}

export async function generateInsights(req: Request, res: Response) {
  try {
    const psicologoId = (req as any).user.id_usuario;
    const rows = await PsychologistService.generateInsightsFromConversation(
      Number(req.params.id),
      psicologoId,
    );
    res.json(success(rows));
  } catch (err: any) {
    res
      .status(err.status || 500)
      .json(fail(err.message || "Error generating insights"));
  }
}
