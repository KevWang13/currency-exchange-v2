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
