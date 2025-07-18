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
