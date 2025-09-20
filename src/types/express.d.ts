import type { User } from "../types.ts";

declare global {
  namespace Express {
    interface Request {
      user?: Pick<User, "id" | "email" | "role">;
    }
  }
}
