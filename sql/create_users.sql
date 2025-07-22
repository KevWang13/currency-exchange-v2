use currency_db;
CREATE TABLE `users` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(64) NOT NULL UNIQUE,
  `email` VARCHAR(128) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `role` ENUM('admin', 'user') NOT NULL DEFAULT 'user',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO users (username, email, password_hash, role)
VALUES
  ('admin', 'admin@example.com', '$2b$10$7qE09XDE1iPWZV8v8eU4T.n9vFv0TtMcLCP1YTPI7D7GZy6YAGwYm', 'admin'), -- password: adminpass
  ('alice', 'alice@example.com', '$2b$10$Qtb0mCyv6EpKJRGIb9FjPuIN8xhLnTxGfnhT.gXnZ8v.CMIXd1HLK', 'user'); -- password: alice123

