-- 1) Currencies table
Use currency_db;

CREATE TABLE `currencies` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `iso_code` CHAR(3) NOT NULL,         -- ISO 4217 code, e.g. 'USD','EUR'
  `name` VARCHAR(128) NOT NULL,        -- e.g. 'Euro'
  `symbol` VARCHAR(8) NULL,            -- e.g. '€'
  `country` VARCHAR(128) NULL,         -- e.g. 'European Union'
  `flag_url` VARCHAR(255) NULL,        -- link to country flag
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_iso` (`iso_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;  

INSERT INTO currencies (iso_code, name, symbol, country, flag_url)
VALUES 
('USD', 'United States Dollar', '$', 'United States', 'https://flagcdn.com/us.svg'),
('EUR', 'Euro', '€', 'European Union', 'https://flagcdn.com/eu.svg'),
('GBP', 'British Pound', '£', 'United Kingdom', 'https://flagcdn.com/gb.svg'),
('JPY', 'Japanese Yen', '¥', 'Japan', 'https://flagcdn.com/jp.svg'),
('CNY', 'Chinese Yuan', '¥', 'China', 'https://flagcdn.com/cn.svg'),
('AUD', 'Australian Dollar', 'A$', 'Australia', 'https://flagcdn.com/au.svg'),
('CAD', 'Canadian Dollar', 'C$', 'Canada', 'https://flagcdn.com/ca.svg'),
('CHF', 'Swiss Franc', 'Fr', 'Switzerland', 'https://flagcdn.com/ch.svg'),
('INR', 'Indian Rupee', '₹', 'India', 'https://flagcdn.com/in.svg'),
('KRW', 'South Korean Won', '₩', 'South Korea', 'https://flagcdn.com/kr.svg'),
('SGD', 'Singapore Dollar', 'S$', 'Singapore', 'https://flagcdn.com/sg.svg'),
('HKD', 'Hong Kong Dollar', 'HK$', 'Hong Kong', 'https://flagcdn.com/hk.svg'),
('NZD', 'New Zealand Dollar', 'NZ$', 'New Zealand', 'https://flagcdn.com/nz.svg'),
('SEK', 'Swedish Krona', 'kr', 'Sweden', 'https://flagcdn.com/se.svg'),
('ZAR', 'South African Rand', 'R', 'South Africa', 'https://flagcdn.com/za.svg');
