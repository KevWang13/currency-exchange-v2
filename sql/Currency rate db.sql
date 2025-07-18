-- Create the database
CREATE DATABASE IF NOT EXISTS exchange_rates_db;
USE exchange_rates_db;

-- Create the Currency table
CREATE TABLE IF NOT EXISTS Currency (
    id INT AUTO_INCREMENT PRIMARY KEY,
    Code VARCHAR(10) NOT NULL,
    Currency_name VARCHAR(100) NOT NULL,
    exchange_rate DECIMAL(10, 4) NOT NULL,
    Date DATE NOT NULL,
    UNIQUE (Code, Date)
);

-- Insert mock exchange rates for 2025-07-17
INSERT INTO Currency (Code, Currency_name, exchange_rate, Date) VALUES
('EUR', 'Euro', 0.89, '2025-07-17'),
('JPY', 'Japanese Yen', 138.25, '2025-07-17'),
('GBP', 'British Pound', 0.76, '2025-07-17'),
('CNY', 'Chinese Yuan', 7.24, '2025-07-17'),
('AUD', 'Australian Dollar', 1.52, '2025-07-17');

-- Insert mock exchange rates for 2025-07-18 (latest)
INSERT INTO Currency (Code, Currency_name, exchange_rate, Date) VALUES
('EUR', 'Euro', 0.90, '2025-07-18'),
('JPY', 'Japanese Yen', 139.00, '2025-07-18'),
('GBP', 'British Pound', 0.75, '2025-07-18'),
('CNY', 'Chinese Yuan', 7.20, '2025-07-18'),
('AUD', 'Australian Dollar', 1.55, '2025-07-18');
