import type { NextFunction, Request, Response } from "express";
import { usersService } from "./users.service.js";
import { SessionManager } from "../utils/sessionManager.js";

async function me(req: Request, res: Response, next: NextFunction) {
  const { id } = req.user!;

  try {
    const user = await usersService.me(id);

    if (!user) {
      await SessionManager.destroy(req);
    }

    res.json({ user });
  } catch (error) {
    next(error);
  }
}

export const usersController = {
  me,
};
