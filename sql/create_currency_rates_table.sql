use currency_db;
-- 2) Rates table (always measured against USD)
CREATE TABLE `currency_rates` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `iso_code` CHAR(3) NOT NULL,                    
  `rate_to_usd` DECIMAL(18,8) NOT NULL,   -- e.g. 1 EUR = 1.12345678 USD
  `last_updated` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_rates_iso` (`iso_code`),
  CONSTRAINT `fk_rates_currency`
    FOREIGN KEY (`iso_code`) REFERENCES `currencies` (`iso_code`)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;  

INSERT INTO currency_rates (iso_code, rate_to_usd)
VALUES
('USD', 1.00000000),
('EUR', 1.09000000),
('GBP', 1.28000000),
('JPY', 0.00680000),
('CNY', 0.13800000),
('AUD', 0.66000000),
('CAD', 0.73000000),
('CHF', 1.11000000),
('INR', 0.01200000),
('KRW', 0.00077000),
('SGD', 0.74000000),
('HKD', 0.12800000),
('NZD', 0.62000000),
('SEK', 0.09400000),
('ZAR', 0.05500000);
