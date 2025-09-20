import type { NextFunction, Request, Response } from "express";
import type { ZodObject } from "zod";
import { BadRequestException } from "../utils/index.js";

export function validate(schema: ZodObject) {
  return (req: Request, _: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const message = result.error._zod.def[0]?.message;
      next(new BadRequestException(message));
      return;
    }

    req.body = result.data;

    next();
  };
}
