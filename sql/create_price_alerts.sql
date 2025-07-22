-- Select the database first (run this as a separate statement if needed)
USE currency_db;

-- Create the table
CREATE TABLE `price_alerts` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL,
  `symbol` VARCHAR(16) NOT NULL,        -- e.g., 'USDJPY'
  `condition` ENUM('gt', 'lt', 'eq') NOT NULL,
  `target_price` DECIMAL(18,8) NOT NULL,
  `is_triggered` BOOLEAN NOT NULL DEFAULT 0,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_alerts_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insert a record
INSERT INTO `price_alerts` (`user_id`, `symbol`, `condition`, `target_price`)
VALUES (2, 'EURUSD', 'gt', 1.13000000);
