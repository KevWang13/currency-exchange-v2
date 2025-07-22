use currency_db;
CREATE TABLE `rate_reservations` (
  `reservation_id` CHAR(36) NOT NULL,  -- UUID
  `user_id` INT UNSIGNED NOT NULL,
  `token` CHAR(36) NOT NULL,
  `currency_pair` VARCHAR(16) NOT NULL,  -- e.g., 'EUR/USD'
  `volume` DECIMAL(18,4) NOT NULL,
  `lock_in_date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `expiration_date` DATETIME NOT NULL,
  `spot_rate` DECIMAL(18,8) NOT NULL,
  `forward_rate` DECIMAL(18,8) DEFAULT NULL,
  `status` ENUM('active','expired','completed') NOT NULL DEFAULT 'active',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`reservation_id`),
  CONSTRAINT `fk_reserve_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO rate_reservations (
  reservation_id, user_id, token, currency_pair, volume,
  lock_in_date, expiration_date, spot_rate, forward_rate, status
)
VALUES (
  UUID(), 2, UUID(), 'USD/EUR', 1000.00,
  NOW(), DATE_ADD(NOW(), INTERVAL 15 MINUTE), 0.8890, 0.8885, 'active'
);
