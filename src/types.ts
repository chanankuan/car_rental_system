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

interface Location {
  name: string;
  building: string;
  city: string;
  street: string;
  postalCode: string;
}

export interface CarRow {
  car: Car;
  totalCount: number;
}

export interface Car {
  id: UUID;
  color: string;
  licensePlateNumber: string;
  currentMileage: number;
  isAvailable: boolean;
  location: Location;
  make: string;
  model: string;
  year: number;
  bagCapacity: number;
  doors: number;
  fuelType: string;
  hasAC: boolean;
  seats: number;
  suitcaseCapacity: number;
  transmissionType: string;
  category: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export const userRoles = ["user", "admin", "manager"];

export type UserRoles = "user" | "admin" | "manager";

export type Role = {
  id: UUID;
  role: UserRoles;
};

export type FilterDefinition = {
  column: string;
  value: string | number | undefined;
};
