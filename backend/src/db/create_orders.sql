DROP TABLE IF EXISTS orders;

CREATE TABLE IF NOT EXISTS  orders (
  order_id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_token VARCHAR(255) NOT NULL UNIQUE,
  user_id INTEGER NOT NULL REFERENCES users (user_id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  
  total_regular_price DECIMAL(10, 2) NOT NULL,
  shipping_cost DECIMAL(10, 2),
  crating_cost DECIMAL(10, 2),
  insurance_cost DECIMAL(10, 2),
  tax DECIMAL(10, 2),
  sub_total DECIMAL(10, 2) NOT NULL,
  discount_amount DECIMAL(10, 2),
  total_final_price DECIMAL(10, 2) NOT NULL,
  min_order_quantity DECIMAL(10, 2) NOT NULL,
  discount DECIMAL(10, 2),
  is_deposit_order BOOLEAN,
  is_usa_or_canada BOOLEAN,
  unit_of_measurement VARCHAR(10),
  quoted_currency VARCHAR(5)
);