import type { NextFunction, Request, Response } from "express";
import { db } from "../db/db.js";
import type { User } from "../types.js";
import { UnauthorizedException } from "../utils/exceptions.js";

export async function isAuthenticated(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  const sessionUser = req.session.user;

  if (!sessionUser || !sessionUser.id) {
    return next(new UnauthorizedException());
  }

  const {
    rows: [user],
  } = await db.query<Pick<User, "id" | "email" | "role">>(
    `
      SELECT
        u.id,
        email,
        role
      FROM users u
      JOIN user_roles ur
      ON u.role_id = ur.id
      WHERE u.id = $1
    `,
    [sessionUser.id]
  );

  if (!user || !user.id || !user.email) {
    return next(new UnauthorizedException());
  }

  req.user = {
    id: user.id,
    email: user.email,
    role: user.role,
  };

  return next();
}
