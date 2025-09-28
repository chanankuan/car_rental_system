import { db } from "../db/db.js";
import type { CarRow, FilterDefinition } from "../types.js";
import { buildWhereClause, NotFoundException } from "../utils/index.js";
import type { FilterParams } from "./types.js";

async function getCars(filterParams: FilterParams) {
  const page = Number(filterParams.page ?? 1);
  const pageSize = Number(filterParams.pageSize ?? 10);

  const offset = (page - 1) * pageSize;

  // Define filters
  const filterDefs: FilterDefinition[] = [
    { column: "cm.make", value: filterParams.make },
    { column: "cm.model", value: filterParams.model },
    {
      column: "cm.seats",
      value: filterParams.seats ? Number(filterParams.seats) : undefined,
    },
    { column: "ft.type", value: filterParams.fuelType },
    {
      column: "cm.small_bags",
      value: filterParams.smallBags
        ? Number(filterParams.smallBags)
        : undefined,
    },
    {
      column: "cm.large_bags",
      value: filterParams.largeBags
        ? Number(filterParams.largeBags)
        : undefined,
    },
    { column: "cc.type", value: filterParams.category },
    { column: "tt.type", value: filterParams.transmissionType },
  ];

  const { whereClause, params } = buildWhereClause(filterDefs);

  const { rows } = await db.query<CarRow>(
    `
      SELECT
        json_build_object(
          'id', c.id,
          'color', c.color,
          'licensePlateNumber', c.license_plate_number,
          'currentMileage', c.current_mileage,
          'isAvailable', c.is_available,
          'location', json_build_object(
            'name', l.name,
            'building', l.building_number,
            'city', l.city,
            'street', l.street,
            'postalCode', l.postal_code
          ),
          'make', cm.make,
          'model', cm.model,
          'year', cm.year,
          'smallBags', cm.small_bags,
          'doors', cm.doors,
          'fuelType', ft.type,
          'hasAC', cm.has_ac,
          'seats', cm.seats,
          'largeBags', cm.large_bags,
          'transmissionType', tt.type,
          'category', cc.type,
          'createdAt', c.created_at,
          'updatedAt', c.updated_at,
          'deletedAt', c.deleted_at
        ) AS car,
        COUNT(*) OVER() AS "totalCount"
      FROM cars c
      JOIN car_models cm          ON c.car_model_id = cm.id
      JOIN transmission_types tt  ON cm.transmission_id = tt.id
      JOIN car_categories cc      ON cm.category_id = cc.id
      JOIN fuel_types ft          ON cm.fuel_type_id = ft.id
      JOIN locations l            ON c.current_location_id = l.id
      ${whereClause}
      ORDER BY c.created_at DESC
      LIMIT $${params.length + 1} OFFSET $${params.length + 2};
    `,
    [...params, pageSize, offset]
  );

  const cars = rows.map(row => row.car);
  const total = Number(rows[0]?.totalCount ?? 0);

  return {
    cars,
    pagination: {
      total,
      page,
      pageSize,
    },
  };
}

async function getCarById(carId: string) {
  const {
    rows: [car],
  } = await db.query<CarRow>(
    `
      SELECT * FROM car_full_json
      WHERE (car->>'id') = $1;
    `,
    [carId]
  );

  if (!car) {
    throw new NotFoundException("Car not found");
  }

  return car;
}

export const carsService = {
  getCars,
  getCarById,
};
