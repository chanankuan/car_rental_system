BEGIN;

CREATE TABLE IF NOT EXISTS user_roles (
    id         UUID        NOT NULL DEFAULT uuid_generate_v4(),
    role       VARCHAR(50) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT pk_user_roles PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS fuel_types (
    id         UUID        NOT NULL DEFAULT uuid_generate_v4(),
    type       VARCHAR(50) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT pk_fuel_types PRIMARY KEY (id)
);

-- Table: locations
CREATE TABLE IF NOT EXISTS locations (
    id              UUID         NOT NULL DEFAULT uuid_generate_v4(),
    name            VARCHAR(100) NOT NULL,
    street          VARCHAR(100) NOT NULL,
    building_number VARCHAR(10)  NOT NULL,
    postal_code     VARCHAR(6)   NOT NULL,
    city            VARCHAR(100) NOT NULL,
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    CONSTRAINT pk_locations PRIMARY KEY (id)
);

-- Table: payment_types
CREATE TABLE IF NOT EXISTS payment_types (
    id          UUID        NOT NULL DEFAULT uuid_generate_v4(),
    type        VARCHAR(50) NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT pk_payment_types PRIMARY KEY (id)
);

-- Table: payments
CREATE TABLE IF NOT EXISTS payments (
    id              UUID           NOT NULL DEFAULT uuid_generate_v4(),
    date            TIMESTAMPTZ    NOT NULL,
    amount          DECIMAL(10, 2) NOT NULL,
    created_at      TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
    payment_type_id UUID           NOT NULL,
    rental_id       UUID           NOT NULL,
    CONSTRAINT pk_payments PRIMARY KEY (id)
);

-- Table: price_tiers
CREATE TABLE IF NOT EXISTS price_tiers (
    id            UUID           NOT NULL DEFAULT uuid_generate_v4(),
    min_days      SMALLINT       NOT NULL,
    max_days      SMALLINT,
    price_per_day DECIMAL(10, 2) NOT NULL,
    car_id        UUID           NOT NULL,
    created_at    TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
    CONSTRAINT pk_price_tiers PRIMARY KEY (id)
);

-- Table: rental_statuses
CREATE TABLE IF NOT EXISTS rental_statuses (
    id         UUID        NOT NULL DEFAULT uuid_generate_v4(),
    status     VARCHAR(50) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT pk_rental_statuses PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS users (
    id           UUID         NOT NULL DEFAULT uuid_generate_v4(),
    first_name   VARCHAR(50)  NOT NULL,
    last_name    VARCHAR(50)  NOT NULL,
    email        VARCHAR(100) NOT NULL UNIQUE,
    phone_number VARCHAR(12)  NOT NULL UNIQUE,
    password     VARCHAR(100) NOT NULL,
    created_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    deleted_at   TIMESTAMPTZ,
    is_verified  BOOLEAN      NOT NULL,
    role_id      UUID         NOT NULL,
    CONSTRAINT pk_users PRIMARY KEY (id)
);

-- Table: user_identifications
CREATE TABLE IF NOT EXISTS user_identifications (
    id                    UUID         NOT NULL DEFAULT uuid_generate_v4(),
    first_name            VARCHAR(100) NOT NULL,
    last_name             VARCHAR(100) NOT NULL,
    passport_number       VARCHAR(50)  NOT NULL UNIQUE,
    driver_license_number VARCHAR(50)  NOT NULL,
    nationality           VARCHAR(100) NOT NULL,
    created_at            TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at            TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    user_id               UUID         NOT NULL,
    CONSTRAINT pk_user_identifications PRIMARY KEY (id)
);

-- Table: rentals
CREATE TABLE IF NOT EXISTS rentals (
    id                          UUID        NOT NULL DEFAULT uuid_generate_v4(),
    planned_pickup_date         TIMESTAMPTZ NOT NULL,
    planned_dropoff_date        TIMESTAMPTZ NOT NULL,
    actual_dropoff_date         TIMESTAMPTZ,
    user_identification_id      UUID        NOT NULL,
    status_id                   UUID        NOT NULL,
    car_id                      UUID        NOT NULL,
    planned_pickup_location_id  UUID        NOT NULL,
    planned_dropoff_location_id UUID        NOT NULL,
    actual_dropoff_location_id  UUID,
    created_at                  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at                  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT pk_rentals PRIMARY KEY (id)
);

-- Table: transmission_types
CREATE TABLE IF NOT EXISTS transmission_types (
    id         UUID        NOT NULL DEFAULT uuid_generate_v4(),
    type       VARCHAR(50) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT pk_transmission_types PRIMARY KEY (id)
);

-- Table: car_categories
CREATE TABLE IF NOT EXISTS car_categories (
    id         UUID        NOT NULL DEFAULT uuid_generate_v4(),
    type       VARCHAR(50) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT pk_car_categories PRIMARY KEY (id)
);

-- Table: car_models
CREATE TABLE IF NOT EXISTS car_models (
    id                UUID          NOT NULL DEFAULT uuid_generate_v4(),
    make              VARCHAR(100)  NOT NULL,
    model             VARCHAR(100)  NOT NULL,
    year              SMALLINT      NOT NULL,
    doors             SMALLINT      NOT NULL,
    has_ac            BOOLEAN       NOT NULL,
    seats             SMALLINT      NOT NULL,
    suitcase_capacity SMALLINT      NOT NULL,
    bag_capacity      SMALLINT      NOT NULL,
    transmission_id   UUID          NOT NULL,
    category_id       UUID          NOT NULL,
    fuel_type_id      UUID          NOT NULL,
    created_at        TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    updated_at        TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    deleted_at        TIMESTAMPTZ,
    CONSTRAINT pk_car_models PRIMARY KEY (id),
    CONSTRAINT uq_make_model_year UNIQUE(make, model, year)
);

-- Table: cars
CREATE TABLE IF NOT EXISTS cars (
    id                   UUID        NOT NULL DEFAULT uuid_generate_v4(),
    color                VARCHAR(50) NOT NULL,
    license_plate_number VARCHAR(8)  NOT NULL UNIQUE,
    current_mileage      INT         NOT NULL,
    is_available         BOOLEAN     NOT NULL,
    created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at           TIMESTAMPTZ,
    car_model_id         UUID        NOT NULL,
    current_location_id  UUID        NOT NULL,
    CONSTRAINT pk_cars PRIMARY KEY (id)
);

-- foreign keys
-- Reference: fk_users_role_id (table: users)
ALTER TABLE users
    ADD CONSTRAINT fk_users_role_id
        FOREIGN KEY (role_id) REFERENCES user_roles (id);

-- Reference: fk_payments_payment_types_id (table: payments)
--            fk_payments_rental_id (table: payments)
ALTER TABLE payments
    ADD CONSTRAINT fk_payments_payment_types_id
        FOREIGN KEY (payment_type_id) REFERENCES payment_types (id),
    ADD CONSTRAINT fk_payments_rental_id
        FOREIGN KEY (rental_id) REFERENCES rentals (id);

-- Reference: fk_price_tiers_car_id (table: price_tiers)
ALTER TABLE price_tiers
    ADD CONSTRAINT fk_price_tiers_car_id
        FOREIGN KEY (car_id) REFERENCES cars (id);

-- Reference: fk_rentals_actual_dropoff_location_id (table: rentals)
--            fk_rentals_planned_dropoff_location_id (table: rentals)
--            fk_rentals_planned_pickup_location_id (table: rentals)
--            fk_rentals_status_id (table: rentals)
--            fk_rentals_user_identification_id (table: rentals)
--            fk_rentals_car_id (table: rentals)
ALTER TABLE rentals
    ADD CONSTRAINT fk_rentals_actual_dropoff_location_id
        FOREIGN KEY (actual_dropoff_location_id) REFERENCES locations (id),
    ADD CONSTRAINT fk_rentals_planned_dropoff_location_id
        FOREIGN KEY (planned_dropoff_location_id) REFERENCES locations (id),
    ADD CONSTRAINT fk_rentals_planned_pickup_location_id
        FOREIGN KEY (planned_pickup_location_id) REFERENCES locations (id),
    ADD CONSTRAINT fk_rentals_status_id
        FOREIGN KEY (status_id) REFERENCES rental_statuses (id),
    ADD CONSTRAINT fk_rentals_user_identification_id
        FOREIGN KEY (user_identification_id) REFERENCES user_identifications (id),
    ADD CONSTRAINT fk_rentals_car_id
        FOREIGN KEY (car_id) REFERENCES cars (id);

-- Reference: fk_users_identification_user_id (table: user_identifications)
ALTER TABLE user_identifications
    ADD CONSTRAINT fk_users_identification_user_id
        FOREIGN KEY (user_id) REFERENCES users (id);

-- Reference: fk_car_current_location_id (table: cars)
-- Reference: fk_cars_car_model_id (table: cars)
ALTER TABLE cars
    ADD CONSTRAINT fk_car_current_location_id
        FOREIGN KEY (current_location_id) REFERENCES locations (id),
    ADD CONSTRAINT fk_cars_car_model_id
        FOREIGN KEY (car_model_id) REFERENCES car_models (id);

-- Reference: fk_car_models_category_id (table: car_models)
-- Reference: fk_car_models_fuel_type_id (table: car_models)
-- Reference: fk_car_models_transmission_id (table: car_models)
ALTER TABLE car_models
    ADD CONSTRAINT fk_car_models_category_id
        FOREIGN KEY (category_id) REFERENCES car_categories (id),
    ADD CONSTRAINT fk_car_models_fuel_type_id
        FOREIGN KEY (fuel_type_id) REFERENCES fuel_types (id),
    ADD CONSTRAINT fk_car_models_transmission_id
        FOREIGN KEY (transmission_id) REFERENCES transmission_types (id);
        
COMMIT;
