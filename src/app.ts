import fs from "node:fs";
import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import morgan from "morgan";
import cors from "cors";
import yaml from "js-yaml";
import swaggerUi from "swagger-ui-express";

import { config } from "./config/index.js";
import { Exception, NotFoundException } from "./utils/index.js";

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

// SWAGGER SETUP
const swaggerFile = fs.readFileSync("./src/swagger/swagger.yaml", "utf8");
const swaggerDocument = yaml.load(swaggerFile) as swaggerUi.JsonObject;

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

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
