import type { NextFunction, Request, Response } from "express";
import { ForbiddenException } from "../utils/exceptions.js";

export function authorizeRoles(...allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const { role: userRole } = req.user!;

    if (!allowedRoles.includes(userRole)) {
      throw new ForbiddenException();
    }
    next();
  };
}
