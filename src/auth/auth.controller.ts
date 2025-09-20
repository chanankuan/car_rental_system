import type { NextFunction, Request, Response } from "express";
import { authService } from "./auth.service.js";
import { SessionManager } from "../utils/index.js";

async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await authService.register(req.body);

    await SessionManager.regenerate(req);

    req.session.user = { id: user.id, email: user.email, role: user.role };

    await SessionManager.save(req);

    res.status(201).json({ user });
  } catch (error) {
    next(error);
  }
}

async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await authService.login(req.body);

    await SessionManager.regenerate(req);

    req.session.user = { id: user.id, email: user.email, role: user.role };

    await SessionManager.save(req);

    res.json({ user });
  } catch (error) {
    next(error);
  }
}

async function logout(req: Request, res: Response, next: NextFunction) {
  try {
    await SessionManager.destroy(req);

    res.status(204).end();
  } catch (error) {
    next(error);
  }
}

async function changePassword(req: Request, res: Response, next: NextFunction) {
  const { id } = req.user!;
  const { oldPassword, newPassword } = req.body;

  try {
    await authService.changePassword(id, oldPassword, newPassword);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
}

export const authController = {
  register,
  login,
  logout,
  changePassword,
};
