import express from "express";

import { usersController } from "./users.controller.js";
import { isAuthenticated } from "../middleware/index.js";

export const usersRouter = express.Router();

usersRouter.get("/me", isAuthenticated, usersController.me);
