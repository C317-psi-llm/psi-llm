import { Request, Response } from "express";
import ConversationService from "../services/conversation.service";
import { success, fail } from "../utils/response";

export async function createConversation(req: Request, res: Response) {
  try {
    const user = (req as any).user;
    const conversation = await ConversationService.create(user.id_usuario);
    res.status(201).json(success(conversation));
  } catch (err: any) {
    res
      .status(err.status || 500)
      .json(fail(err.message || "Error creating conversation"));
  }
}

export async function getConversation(req: Request, res: Response) {
  try {
    const user = (req as any).user;
    const { id } = req.params;
    const data = await ConversationService.getByIdForUser(
      Number(id),
      user.id_usuario,
    );
    res.json(success(data));
  } catch (err: any) {
    res
      .status(err.status || 500)
      .json(fail(err.message || "Error fetching conversation"));
  }
}

export async function getUserConversations(req: Request, res: Response) {
  try {
    const user = (req as any).user;
    const { id } = req.params;
    const page = Number(req.query.page) || 1;
    const data = await ConversationService.listForUser(
      Number(id),
      user.id_usuario,
      page,
    );
    res.json(success(data));
  } catch (err: any) {
    res
      .status(err.status || 500)
      .json(fail(err.message || "Error listing conversations"));
  }
}

export async function postMessage(req: Request, res: Response) {
  try {
    const user = (req as any).user;
    const { id } = req.params;
    const { content } = req.body;
    await ConversationService.handleIncomingMessage({
      id_conversa: Number(id),
      id_usuario: user.id_usuario,
      content,
      res,
    });
  } catch (err: any) {
    if (res.headersSent) {
      try {
        res.write(`event: error\n`);
        res.write(
          `data: ${JSON.stringify({ message: err.message || "Error processing message" })}\n\n`,
        );
        res.end();
      } catch {
        // ignore
      }
      return;
    }
    res
      .status(err.status || 500)
      .json(fail(err.message || "Error processing message"));
  }
}
