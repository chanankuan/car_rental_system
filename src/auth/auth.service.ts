import { db } from "../db/db.js";
import type { LoginInput, RegisterInput } from "./auth.schema.js";
import type { PublicUser, Role, User } from "../types.js";
import {
  BadRequestException,
  ConflictException,
  PasswordManager,
  UnauthorizedException,
} from "../utils/index.js";
import type { UUID } from "node:crypto";

async function register(registerDto: RegisterInput) {
  const { firstName, lastName, email, phoneNumber, password } = registerDto;
  const userRole = "user";

  const {
    rows: [role],
  } = await db.query<Role>(
    `
    SELECT
      id
    FROM user_roles
    WHERE role = $1;
  `,
    [userRole]
  );

  if (!role) {
    throw new Error();
  }

  // Check for existing user
  const {
    rows: [existingUser],
  } = await db.query<Pick<User, "email" | "phoneNumber">>(
    `
      SELECT
        email,
        phone_number "phoneNumber"
      FROM users
      WHERE email = $1 OR phone_number = $2;
    `,
    [email, phoneNumber]
  );

  // Ensure email and phoneNumber do not exist
  if (existingUser) {
    throw new ConflictException("An account with these details already exists");
  }

  const hashedPassword = await PasswordManager.hash(password);

  await db.query<PublicUser>(
    `
      INSERT INTO users (first_name, last_name, email, phone_number, password, is_verified, role_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `,
    [firstName, lastName, email, phoneNumber, hashedPassword, true, role.id]
  );

  const {
    rows: [newUser],
  } = await db.query<PublicUser>(
    `
    SELECT
      u.id,
      first_name "firstName",
      last_name "lastName",
      email,
      phone_number "phoneNumber",
      is_verified "isVerified",
      role
    FROM users u
    JOIN user_roles ur
    ON u.role_id = ur.id
    WHERE email = $1;
  `,
    [email]
  );

  if (!newUser) throw new BadRequestException("Failed to insert user");

  return newUser;
}

async function login(loginDto: LoginInput) {
  const { email, password } = loginDto;

  const {
    rows: [dbUser],
  } = await db.query<PublicUser & Pick<User, "password">>(
    `
      SELECT
        u.id,
        first_name "firstName",
        last_name "lastName",
        email,
        password,
        phone_number "phoneNumber",
        is_verified "isVerified",
        role
      FROM users u
      JOIN user_roles ur
      ON u.role_id = ur.id
      WHERE email = $1;
    `,
    [email]
  );

  if (!dbUser || !(await PasswordManager.compare(password, dbUser.password))) {
    throw new UnauthorizedException("Invalid credentials");
  }

  const { password: hashPassword, ...user } = dbUser;

  return user as PublicUser;
}

async function changePassword(
  id: UUID,
  oldPassword: string,
  newPassword: string
) {
  const {
    rows: [dbUser],
  } = await db.query<PublicUser & Pick<User, "password">>(
    `
      SELECT
        u.id,
        first_name "firstName",
        last_name "lastName",
        email,
        password,
        phone_number "phoneNumber",
        is_verified "isVerified",
        role
      FROM users u
      JOIN user_roles ur
      ON u.role_id = ur.id
      WHERE u.id = $1;
    `,
    [id]
  );

  if (!dbUser) {
    throw new UnauthorizedException("Invalid credentials");
  }

  if (oldPassword === newPassword) {
    throw new BadRequestException("New password must be different");
  }

  const isValidPassword = await PasswordManager.compare(
    oldPassword,
    dbUser.password
  );

  if (!isValidPassword) {
    throw new UnauthorizedException("Invalid credentials");
  }

  const hashedPassword = await PasswordManager.hash(newPassword);

  await db.query<PublicUser>(
    `
      UPDATE users
         SET password = $1
       WHERE id = $2`,
    [hashedPassword, id]
  );
}

export const authService = {
  register,
  login,
  changePassword,
};
