-- Create databases for each service
CREATE DATABASE IF NOT EXISTS api_gateway_db;
CREATE DATABASE IF NOT EXISTS flights_booking_db;
CREATE DATABASE IF NOT EXISTS flights_db;
CREATE DATABASE IF NOT EXISTS notifications_db;

-- Grant permissions
GRANT ALL PRIVILEGES ON api_gateway_db.* TO 'flights_user'@'%';
GRANT ALL PRIVILEGES ON flights_booking_db.* TO 'flights_user'@'%';
GRANT ALL PRIVILEGES ON flights_db.* TO 'flights_user'@'%';
GRANT ALL PRIVILEGES ON notifications_db.* TO 'flights_user'@'%';
FLUSH PRIVILEGES;
