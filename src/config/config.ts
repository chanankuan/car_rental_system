import dotenv from "dotenv";

dotenv.config();

interface Config {
  port: number;
  nodeEnv: string;
  sessionSecret: string;
  redisUrl: string;
  postgresHost: string;
  postgresPort: number;
  postgresUser: string;
  postgresPassword: string;
  postgresDb: string;
}

export const config: Config = {
  port: Number(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || "production",
  sessionSecret: process.env.SESSION_SECRET!,
  redisUrl: process.env.REDIS_URL!,
  postgresHost:
    process.env.NODE_ENV === "development"
      ? "localhost"
      : process.env.POSTGRES_HOST!,
  postgresPort: Number(process.env.POSTGRES_PORT || 5432),
  postgresUser: process.env.POSTGRES_USER || "",
  postgresPassword: process.env.POSTGRES_PASSWORD || "",
  postgresDb: process.env.POSTGRES_DB || "",
};
