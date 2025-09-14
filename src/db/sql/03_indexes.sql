-- users.role_id
CREATE INDEX idx_users_role_id ON users(role_id);

-- user_identifications.user_id
CREATE INDEX idx_user_identifications_user_id ON user_identifications(user_id);

-- rentals.user_identification_id
CREATE INDEX idx_rentals_user_identification_id ON rentals(user_identification_id);

-- rentals.car_id
CREATE INDEX idx_rentals_car_id ON rentals(car_id);

-- rentals.status_id
CREATE INDEX idx_rentals_status_id ON rentals(status_id);

-- rentals.planned_pickup_location_id
CREATE INDEX idx_rentals_planned_pickup_location_id ON rentals(planned_pickup_location_id);

-- rentals.planned_dropoff_location_id
CREATE INDEX idx_rentals_planned_dropoff_location_id ON rentals(planned_dropoff_location_id);

-- rentals.actual_dropoff_location_id
CREATE INDEX idx_rentals_actual_dropoff_location_id ON rentals(actual_dropoff_location_id);

-- rentals.planned_pickup_date
CREATE INDEX idx_rentals_planned_pickup_date ON rentals(planned_pickup_date);

-- rentals.planned_dropoff_date
CREATE INDEX idx_rentals_planned_dropoff_date ON rentals(planned_dropoff_date);

-- rentals.actual_dropoff_date
CREATE INDEX idx_rentals_actual_dropoff_date ON rentals(actual_dropoff_date);

-- payments.payment_type_id
CREATE INDEX idx_payments_payment_type_id ON payments(payment_type_id);

-- payments.rental_id
CREATE INDEX idx_payments_rental_id ON payments(rental_id);

-- price_tiers.car_id
CREATE INDEX idx_price_tiers_car_id ON price_tiers(car_id);

-- cars.car_model_id
CREATE INDEX idx_cars_car_model_id ON cars(car_model_id);

-- cars.current_location_id
CREATE INDEX idx_cars_current_location_id ON cars(current_location_id);

-- cars.is_available
CREATE INDEX idx_cars_is_active ON cars(is_available);

-- car_models.category_id
CREATE INDEX idx_car_models_category_id ON car_models(category_id);

-- car_models.fuel_type_id
CREATE INDEX idx_car_models_fuel_type_id ON car_models(fuel_type_id);

-- car_models.transmission_id
CREATE INDEX idx_car_models_transmission_id ON car_models(transmission_id);
