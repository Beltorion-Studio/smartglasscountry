DROP TABLE IF EXISTS order_products;

CREATE TABLE IF NOT EXISTS order_products (
  order_product_id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_token VARCHAR(255) NOT NULL REFERENCES orders (order_token),
  width DECIMAL(10, 2) NOT NULL,
  height DECIMAL(10, 2) NOT NULL,
  quantity INTEGER NOT NULL,
  product_type VARCHAR(30) NOT NULL,
  square_footage DECIMAL(10, 2),
  square_meterage DECIMAL(10, 2),
  product_size DECIMAL(10, 2),
  total_price DECIMAL(10, 2) NOT NULL,
  unit_price DECIMAL(10, 2) NOT NULL,
  insurance_percentage DECIMAL(10, 2),
  shipping_cost DECIMAL(10, 2),
  unit_of_measurement VARCHAR(10)
);
