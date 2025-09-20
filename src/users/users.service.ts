import { db } from "../db/db.js";
import type { UUID } from "node:crypto";
import type { PublicUser } from "../types.js";

async function me(id: UUID) {
  const {
    rows: [dbUser],
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
      WHERE u.id = $1;
    `,
    [id]
  );

  return dbUser;
}

export const usersService = {
  me,
};
