import "express-session";
import type { UUID } from "node:crypto";
import type { UserRoles } from "../types.ts";

declare module "express-session" {
  interface SessionData {
    user?: {
      id: UUID;
      email: string;
      role: UserRoles;
    } | null;
  }
}
