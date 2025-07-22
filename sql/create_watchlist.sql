use currency_db;
CREATE TABLE `watchlist` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL,
  `symbol` VARCHAR(16) NOT NULL,  -- e.g., 'EURUSD'
  `target_price` DECIMAL(18,8) NOT NULL,
  `alert_triggered` BOOLEAN NOT NULL DEFAULT 0,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_user_symbol` (`user_id`, `symbol`),
  CONSTRAINT `fk_watchlist_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


INSERT INTO watchlist (user_id, symbol, target_price)
VALUES 
  (2, 'EURUSD', 1.15000000),
  (2, 'USDJPY', 160.00000000);
