import express from "express";

import { carsController } from "./cars.controller.js";
import { authorizeRoles, isAuthenticated } from "../middleware/index.js";

export const carsRouter = express.Router();

carsRouter.get("/", isAuthenticated, carsController.getCars);

carsRouter.get("/:carId", isAuthenticated, carsController.getCarById);
