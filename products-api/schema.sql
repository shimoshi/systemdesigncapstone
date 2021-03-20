DROP DATABASE IF EXISTS products;

CREATE DATABASE products;

\c products;

CREATE TABLE products (
  id int primary key NOT NULL,
  name varchar(50) NOT NULL,
  slogan varchar(500) NOT NULL,
  description varchar(5000) NOT NULL,
  category varchar(50) NOT NULL,
  default_price varchar(50) NOT NULL
);

COPY products (id, name, slogan, description, category, default_price)
FROM '/Users/Timmy/Downloads/products.csv'
DELIMITER ','
CSV HEADER;

CREATE TABLE styles (
  id int primary key NOT NULL,
  product_id int NOT NULL,
  name varchar(50) NOT NULL,
  sale_price varchar(50),
  original_price varchar(50) NOT NULL,
  default_style bit NOT NULL,
  constraint fk_product
    foreign key(product_id)
      references products(id)
);

COPY styles (id, product_id, name, sale_price, original_price, default_style)
FROM '/Users/Timmy/Downloads/styles.csv'
DELIMITER ','
CSV HEADER;

CREATE TABLE skus (
  id int primary key NOT NULL,
  style_id int NOT NULL,
  size varchar(50) NOT NULL,
  quantity int NOT NULL,
  constraint fk_style
    foreign key(style_id)
      references styles(id)
);

COPY skus (id, style_id, size, quantity)
FROM '/Users/Timmy/Downloads/skus.csv'
DELIMITER ','
CSV HEADER;

CREATE TABLE features (
  id int primary key NOT NULL,
  product_id int NOT NULL,
  feature varchar(50) NOT NULL,
  type varchar(50),
  constraint fk_product
    foreign key(product_id)
      references products(id)
);

COPY features (id, product_id, feature, type)
FROM '/Users/Timmy/Downloads/features.csv'
WITH null as '' csv;

CREATE TABLE photos (
  id int NOT NULL,
  style_id int NOT NULL,
  thumbnail_url varchar(500000) NOT NULL,
  url varchar(500000) NOT NULL,
  constraint fk_style
    foreign key(style_id)
      references styles(id)
);

COPY photos (id, style_id, thumbnail_url, url)
FROM '/Users/Timmy/Downloads/photos.csv'
DELIMITER ','
CSV HEADER;

CREATE TABLE related (
  id int primary key NOT NULL,
  product_id int NOT NULL,
  related_id int NOT NULL,
  constraint fk_product
    foreign key(product_id)
      references products(id)
);

COPY related (id, product_id, related_id)
FROM '/Users/Timmy/Downloads/related.csv'
DELIMITER ','
CSV HEADER;

-- $ brew services start postgresql
-- $ psql postgres