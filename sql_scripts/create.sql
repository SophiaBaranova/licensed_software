CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(20) NOT NULL UNIQUE,
    description TEXT
);

CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name TEXT NOT NULL,
    short_description TEXT NOT NULL,
    extended_description TEXT,
    price DECIMAL(10,2) NOT NULL,
    vendor TEXT NOT NULL,
    license TEXT NOT NULL,
    category_id INT NOT NULL,
    version TEXT NOT NULL,
    supported_os TEXT NOT NULL,
    download_url TEXT NOT NULL,
    image_url TEXT,

    CONSTRAINT fk_products_category
        FOREIGN KEY (category_id)
        REFERENCES categories(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE INDEX idx_category_id ON products(category_id);

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    login VARCHAR(20) NOT NULL UNIQUE,
    email TEXT NOT NULL,
    password TEXT NOT NULL,
    role ENUM('admin', 'user') NOT NULL DEFAULT 'user'
);
