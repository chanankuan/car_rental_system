DO $$
DECLARE
    -- User roles
    roleAdminId          UUID := uuid_generate_v4();
    roleUserId           UUID := uuid_generate_v4();
    roleManagerId        UUID := uuid_generate_v4();

    -- Fuel types
    fuelPetrolId         UUID := uuid_generate_v4();
    fuelDieselId         UUID := uuid_generate_v4();
    fuelHybridId         UUID := uuid_generate_v4();
    fuelElectricId       UUID := uuid_generate_v4();

    -- Transmission types
    transManualId        UUID := uuid_generate_v4();
    transAutoId          UUID := uuid_generate_v4();

    -- Car categories
    catEconomyId         UUID := uuid_generate_v4();
    catSUVId             UUID := uuid_generate_v4();
    catPremiumId          UUID := uuid_generate_v4();

    -- Locations
    locCenterId          UUID := uuid_generate_v4();
    locAirportId         UUID := uuid_generate_v4();
    locPragaId           UUID := uuid_generate_v4();

    -- Car models
    modelToyotaCorollaId UUID := uuid_generate_v4();
    modelFordFocusId     UUID := uuid_generate_v4();
    modelBMWX5Id         UUID := uuid_generate_v4();
    modelTeslaModel3Id   UUID := uuid_generate_v4();
    modelAudiA4Id        UUID := uuid_generate_v4();

    -- Cars
    carIds           UUID[] := ARRAY[
        uuid_generate_v4(), uuid_generate_v4(), uuid_generate_v4(), uuid_generate_v4(),
        uuid_generate_v4(), uuid_generate_v4(), uuid_generate_v4(), uuid_generate_v4(),
        uuid_generate_v4(), uuid_generate_v4()
    ];
BEGIN
    -- User roles
    INSERT INTO user_roles (id, role)
    VALUES
        (roleAdminId, 'admin'),
        (roleUserId, 'user'),
        (roleManagerId, 'manager');

    INSERT INTO payment_types(type)
    VALUES
        ('cash'),
        ('card'),
        ('bank transfer');

    -- Fuel types
    INSERT INTO fuel_types(id, type)
    VALUES
        (fuelPetrolId, 'petrol'),
        (fuelDieselId, 'diesel'),
        (fuelHybridId, 'hybrid'),
        (fuelElectricId, 'electric');

    -- Transmission types
    INSERT INTO transmission_types(id, type)
    VALUES
        (transManualId, 'manual'),
        (transAutoId, 'automatic');

    -- Car categories
    INSERT INTO car_categories(id, type)
    VALUES
        (catEconomyId, 'economy'),
        (catSUVId, 'suv'),
        (catPremiumId, 'premium');

    -- Rental statuses
    INSERT INTO rental_statuses (status)
    VALUES
        ('pending'),
        ('confirmed'),
        ('in progress'),
        ('completed'),
        ('cancelled');

    -- Locations (Warsaw)
    INSERT INTO locations(id, name, street, building_number, postal_code, city)
    VALUES
        (locCenterId, 'Warsaw City Center', 'Marszałkowska', '50', '00-001', 'Warsaw'),
        (locAirportId, 'Warsaw Chopin Airport', 'Żwirki i Wigury', '1', '00-906', 'Warsaw'),
        (locPragaId, 'Praga District', 'Targowa', '25', '03-734', 'Warsaw');

    -- Car models
    INSERT INTO car_models(id, make, model, year, doors, has_ac, seats, suitcase_capacity, bag_capacity, transmission_id, category_id, fuel_type_id)
    VALUES
        (modelToyotaCorollaId, 'Toyota', 'Corolla', 2023, 4, TRUE, 5, 2, 2, transAutoId, catEconomyId, fuelPetrolId),
        (modelFordFocusId, 'Ford', 'Focus', 2022, 4, TRUE, 5, 2, 2, transManualId, catEconomyId, fuelDieselId),
        (modelBMWX5Id, 'BMW', 'X5', 2023, 5, TRUE, 5, 3, 2, transAutoId, catSUVId, fuelDieselId),
        (modelTeslaModel3Id, 'Tesla', 'Model 3', 2024, 4, TRUE, 5, 2, 2, transAutoId, catPremiumId, fuelElectricId),
        (modelAudiA4Id, 'Audi', 'A4', 2023, 4, TRUE, 5, 2, 2, transManualId, catPremiumId, fuelPetrolId);

    -- cars (10 cars, Warsaw plates)
    INSERT INTO cars(id, color, license_plate_number, current_mileage, is_available, car_model_id, current_location_id)
    VALUES
        (carIds[1], 'red', 'WA12345', 12000, TRUE, modelToyotaCorollaId, locCenterId),
        (carIds[2], 'blue', 'WA23456', 15000, TRUE, modelToyotaCorollaId, locCenterId),
        (carIds[3], 'white', 'WA34567', 8000, TRUE, modelFordFocusId, locPragaId),
        (carIds[4], 'black', 'WA45678', 5000, TRUE, modelFordFocusId, locPragaId),
        (carIds[5], 'silver', 'WA56789', 10000, TRUE, modelBMWX5Id, locAirportId),
        (carIds[6], 'blue', 'WA67890', 7000, TRUE, modelBMWX5Id, locAirportId),
        (carIds[7], 'white', 'WA78901', 4000, TRUE, modelTeslaModel3Id, locCenterId),
        (carIds[8], 'red', 'WA89012', 3000, TRUE, modelTeslaModel3Id, locAirportId),
        (carIds[9], 'black', 'WA90123', 9000, TRUE, modelAudiA4Id, locCenterId),
        (carIds[10], 'silver', 'WA01234', 6000, TRUE, modelAudiA4Id, locPragaId);

    -- Price tiers
    INSERT INTO price_tiers(min_days, max_days, price_per_day, car_id)
    VALUES
        -- car 1 (Toyota Corolla Red, Economy)
        (1, 2, 180.00, carIds[1]),
        (3, 5, 170.00, carIds[1]),
        (6, NULL, 160.00, carIds[1]),

        -- car 2 (Toyota Corolla Blue, Economy)
        (1, 2, 180.00, carIds[2]),
        (3, 5, 170.00, carIds[2]),
        (6, NULL, 160.00, carIds[2]),

        -- car 3 (Ford Focus White, Economy)
        (1, 2, 190.00, carIds[3]),
        (3, 5, 180.00, carIds[3]),
        (6, NULL, 170.00, carIds[3]),

        -- car 4 (Ford Focus Black, Economy)
        (1, 2, 190.00, carIds[4]),
        (3, 5, 180.00, carIds[4]),
        (6, NULL, 170.00, carIds[4]),

        -- car 5 (BMW X5 Silver, SUV)
        (1, 2, 320.00, carIds[5]),
        (3, 5, 310.00, carIds[5]),
        (6, NULL, 295.00, carIds[5]),

        -- car 6 (BMW X5 Blue, SUV)
        (1, 2, 320.00, carIds[6]),
        (3, 5, 310.00, carIds[6]),
        (6, NULL, 295.00, carIds[6]),

        -- car 7 (Tesla Model 3 White, Electric)
        (1, 2, 340.00, carIds[7]),
        (3, 5, 330.00, carIds[7]),
        (6, NULL, 315.00, carIds[7]),

        -- car 8 (Tesla Model 3 Red, Electric)
        (1, 2, 340.00, carIds[8]),
        (3, 5, 330.00, carIds[8]),
        (6, NULL, 315.00, carIds[8]),

        -- car 9 (Audi A4 Black, Luxury)
        (1, 2, 325.00, carIds[9]),
        (3, 5, 318.00, carIds[9]),
        (6, NULL, 300.00, carIds[9]),

        -- car 10 (Audi A4 Silver, Luxury)
        (1, 2, 321.00, carIds[10]),
        (3, 5, 314.00, carIds[10]),
        (6, NULL, 298.00, carIds[10]);
END
$$;
