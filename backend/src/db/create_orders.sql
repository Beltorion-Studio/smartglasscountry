DROP TABLE IF EXISTS orders;

CREATE TABLE IF NOT EXISTS  orders (
  order_id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_token VARCHAR(255) NOT NULL UNIQUE,
  user_id INTEGER NOT NULL REFERENCES users (user_id),
  discount DECIMAL(10, 2),
  unit_of_measurement VARCHAR(10),
  total_regular_price DECIMAL(10, 2) NOT NULL,
  discount_amount DECIMAL(10, 2),
  total_final_price DECIMAL(10, 2) NOT NULL,
  quoted_currency VARCHAR(5),
  crating_cost DECIMAL(10, 2),
  insurance_cost DECIMAL(10, 2),
  tax DECIMAL(10, 2),
  shipping_cost DECIMAL(10, 2),
  sub_total DECIMAL(10, 2) NOT NULL,
  discount_period INTEGER,
  min_order_quantity INTEGER,
  is_new_order BOOLEAN,
  is_usa_or_canada BOOLEAN,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP  
);