import { Request, Response } from "express";
import AuthService from "../services/auth.service";
import { success, fail } from "../utils/response";
import UserRepository from "../repositories/user.repository";

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    const { accessToken, refreshToken, user } = await AuthService.login(
      email,
      password,
    );
    // update last access
    await UserRepository.updateLastAccess(user.id_usuario);
    res.json(success({ accessToken, refreshToken, user }));
  } catch (err: any) {
    res.status(err.status || 500).json(fail(err.message || "Login failed"));
  }
}

export async function refresh(req: Request, res: Response) {
  try {
    const { refreshToken } = req.body;
    const tokens = await AuthService.refresh(refreshToken);
    res.json(success(tokens));
  } catch (err: any) {
    res.status(err.status || 500).json(fail(err.message || "Refresh failed"));
  }
}

export async function logout(req: Request, res: Response) {
  try {
    const { refreshToken } = req.body;
    await AuthService.logout(refreshToken);
    res.json(success({ message: "Logged out" }));
  } catch (err: any) {
    res.status(err.status || 500).json(fail(err.message || "Logout failed"));
  }
}

export async function me(req: Request, res: Response) {
  const user = (req as any).user;
  res.json(success(user));
}
