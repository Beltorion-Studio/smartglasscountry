DROP TABLE IF EXISTS deposit_order_details;

CREATE TABLE IF NOT EXISTS deposit_order_details (
  deposit_product_id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_token VARCHAR(255) NOT NULL REFERENCES orders (order_token),
  deposit_payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  discount_period_expiry TIMESTAMP NOT NULL,
  discount_period INTEGER NOT NULL,
  is_reminder_sent BOOLEAN NOT NULL DEFAULT FALSE,
  FOREIGN KEY (order_token) REFERENCES orders (order_token)
);
