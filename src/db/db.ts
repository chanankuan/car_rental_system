import { Pool } from "pg";
import { config } from "../config/config.js";

export const db = new Pool({
  user: config.postgresUser,
  password: config.postgresPassword,
  host: config.postgresHost,
  port: config.postgresPort,
  database: config.postgresDb,
});

db.connect()
  .then(() => console.log("Connected to Postgres"))
  .catch(err => console.error("Postgres connection error:", err));
