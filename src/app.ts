import fs from "node:fs";
import { randomUUID } from "node:crypto";
import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import morgan from "morgan";
import cors from "cors";
import yaml from "js-yaml";
import swaggerUi from "swagger-ui-express";
import { createClient } from "redis";
import { RedisStore } from "connect-redis";
import session from "express-session";

import { authRouter } from "./auth/index.js";
import { usersRouter } from "./users/index.js";
import { config } from "./config/index.js";
import { Exception, NotFoundException } from "./utils/index.js";
import { carsRouter } from "./cars/cars.router.js";

export const app = express();

// LOGGER
if (config.nodeEnv === "development") {
  app.use(
    morgan("dev", {
      skip: req => req.url.includes(".well-known"),
    })
  );
}

// TODO: ADD WHITELIST
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// CREATE REDIS CLIENT
const redisClient = createClient({
  url: config.redisUrl,
});

redisClient.connect().catch(console.error); // Connect to Redis

// CREATE REDIS STORE
const redisStore = new RedisStore({
  client: redisClient,
  prefix: "myapp:",
});

app.use(
  session({
    store: redisStore,
    name: "sid",
    resave: false, // force lightweight session keep alive (touch)
    saveUninitialized: false, // only save session when data exists
    secret: config.sessionSecret,
    cookie: {
      httpOnly: true,
      secure: config.nodeEnv === "production", // only HTTPS in prod
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
    genid: function () {
      return randomUUID();
    },
  })
);

// SWAGGER SETUP
const swaggerFile = fs.readFileSync("./src/swagger/swagger.yaml", "utf8");
const swaggerDocument = yaml.load(swaggerFile) as swaggerUi.JsonObject;

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);
app.use("/api/cars", carsRouter);

app.use((_, res, next) => {
  next(new NotFoundException("Route not found"));
});

app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof Exception) {
    const { statusCode, error, message } = err;

    return res.status(statusCode).json({
      statusCode: statusCode,
      error: error,
      message: message,
    });
  }

  res.status(500).json({
    statusCode: 500,
    error: "InternalServerError",
    message: "Server error",
  });
});

app.listen(config.port, () => {
  console.log(`Server running on http://localhost:${config.port}`);
});
