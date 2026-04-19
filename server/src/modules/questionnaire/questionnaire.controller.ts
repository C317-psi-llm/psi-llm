import { Request, Response } from "express";
import {
  getQuestionario,
  listarQuestionarios,
  responderQuestionario,
  historicoRespostas,
} from "./questionnaire.service";

export async function listar(req: Request, res: Response): Promise<void> {
  try {
    const lista = await listarQuestionarios();
    res.status(200).json(lista);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
}

export async function buscar(req: Request, res: Response): Promise<void> {
  try {
    const id = parseInt(req.params.id);
    const q = await getQuestionario(id);
    res.status(200).json(q);
  } catch (err: any) {
    res.status(404).json({ message: err.message });
  }
}

export async function responder(req: Request, res: Response): Promise<void> {
  try {
    const id_usuario = req.user!.id_usuario;
    const id_questionario = parseInt(req.params.id);
    const { respostas } = req.body;

    if (!respostas || typeof respostas !== "object") {
      res.status(400).json({ message: 'Campo "respostas" é obrigatório.' });
      return;
    }

    const resultado = await responderQuestionario(
      id_usuario,
      id_questionario,
      respostas,
    );
    res.status(201).json(resultado);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
}

export async function historico(req: Request, res: Response): Promise<void> {
  try {
    const id_usuario = req.user!.id_usuario;
    const lista = await historicoRespostas(id_usuario);
    res.status(200).json(lista);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
}
