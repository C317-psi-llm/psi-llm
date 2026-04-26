import { Request, Response } from "express";
import QuestionnaireService from "../services/questionnaire.service";
import { success, fail } from "../utils/response";

export async function listQuestionnaires(_req: Request, res: Response) {
  try {
    const data = await QuestionnaireService.list();
    res.json(success(data));
  } catch (err: any) {
    res
      .status(err.status || 500)
      .json(fail(err.message || "Error listing questionnaires"));
  }
}

export async function getQuestionnaire(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const q = await QuestionnaireService.getById(Number(id));
    if (!q) return res.status(404).json(fail("Questionnaire not found"));
    res.json(success(q));
  } catch (err: any) {
    res
      .status(err.status || 500)
      .json(fail(err.message || "Error fetching questionnaire"));
  }
}

export async function submitResponse(req: Request, res: Response) {
  try {
    const user = (req as any).user;
    const { id } = req.params;
    const { responses } = req.body;
    if (!responses) return res.status(400).json(fail("Missing responses"));
    const saved = await QuestionnaireService.saveResponse({
      id_usuario: user.id_usuario,
      id_questionario: Number(id),
      answers: responses,
    });
    res.status(201).json(success(saved));
  } catch (err: any) {
    res
      .status(err.status || 500)
      .json(fail(err.message || "Error saving response"));
  }
}

export async function history(req: Request, res: Response) {
  try {
    const user = (req as any).user;
    const data = await QuestionnaireService.historyByUser(user.id_usuario);
    res.json(success(data));
  } catch (err: any) {
    res
      .status(err.status || 500)
      .json(fail(err.message || "Error fetching history"));
  }
}
