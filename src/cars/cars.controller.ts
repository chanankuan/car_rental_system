import type { NextFunction, Request, Response } from "express";
import { carsService } from "./cars.service.js";

async function getCars(req: Request, res: Response, next: NextFunction) {
  try {
    const cars = await carsService.getCars(req.query);

    res.json(cars);
  } catch (error) {
    next(error);
  }
}

async function getCarById(req: Request, res: Response, next: NextFunction) {
  const { carId } = req.params;

  if (carId) {
    try {
      const car = await carsService.getCarById(carId);

      res.json(car);
    } catch (error) {
      next(error);
    }
  }
}

export const carsController = {
  getCars,
  getCarById,
};
