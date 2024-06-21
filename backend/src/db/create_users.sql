DROP TABLE IF EXISTS users;
CREATE TABLE IF NOT EXISTS users (
  user_id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_name VARCHAR(100) NOT NULL,
  email VARCHAR(100)  NOT NULL,
  phone VARCHAR(20),
  project_type VARCHAR(25) NOT NULL,
  role_in_project VARCHAR(50) NOT NULL,
  user_location VARCHAR(50) NOT NULL,
  country VARCHAR(50) NOT NULL,
  state_or_province VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
