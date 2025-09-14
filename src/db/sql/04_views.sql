-- Active rentals with user and car info
CREATE OR REPLACE VIEW active_rentals AS
SELECT 
    r.id AS rental_id,
    r.planned_pickup_date,
    r.planned_dropoff_date,
    r.actual_dropoff_date,
    u.first_name,
    u.last_name,
    c.license_plate_number,
    vm.make,
    vm.model,
    vm.year,
    l_pickup.name AS pickup_location,
    l_dropoff.name AS dropoff_location,
    rs.status AS rental_status
FROM rentals r
JOIN user_identifications ui ON r.user_identification_id = ui.id
JOIN users u ON ui.user_id = u.id
JOIN cars c ON r.car_id = c.id
JOIN car_models vm ON c.car_model_id = vm.id
JOIN locations l_pickup ON r.planned_pickup_location_id = l_pickup.id
JOIN locations l_dropoff ON r.planned_dropoff_location_id = l_dropoff.id
JOIN rental_statuses rs ON r.status_id = rs.id
WHERE rs.status = 'active';

-- car availability summary
CREATE OR REPLACE VIEW car_availability AS
SELECT
    vm.make,
    vm.model,
    COUNT(c.id) AS total_cars,
    SUM(CASE WHEN c.is_available THEN 1 ELSE 0 END) AS active_cars
FROM cars c
JOIN car_models vm ON c.car_model_id = vm.id
GROUP BY vm.make, vm.model;

-- Revenue per car
CREATE OR REPLACE VIEW car_revenue AS
SELECT
    c.license_plate_number,
    vm.make,
    vm.model,
    SUM(p.amount) AS total_revenue
FROM payments p
JOIN rentals r ON p.rental_id = r.id
JOIN cars c ON r.car_id = c.id
JOIN car_models vm ON c.car_model_id = vm.id
GROUP BY c.license_plate_number, vm.make, vm.model;
