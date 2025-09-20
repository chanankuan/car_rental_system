import type { UUID } from "node:crypto";

export type HttpException = {
  status: number;
  message: string;
};

export interface User {
  id: UUID;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  created_at: string;
  updated_at: string;
  deleted_at: string;
  isVerified: boolean;
  role: UserRoles;
}

export type PublicUser = Pick<
  User,
  | "id"
  | "firstName"
  | "lastName"
  | "email"
  | "phoneNumber"
  | "isVerified"
  | "role"
>;

export const userRoles = ["user", "admin", "manager"];

export type UserRoles = "user" | "admin" | "manager";

export type Role = {
  id: UUID;
  role: UserRoles;
};
