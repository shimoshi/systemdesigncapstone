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

CREATE TABLE skus (
  id int primary key NOT NULL,
  style_id int NOT NULL,
  size varchar(50) NOT NULL,
  quantity int NOT NULL,
  constraint fk_style
    foreign key(style_id)
      references styles(id)
);

CREATE TABLE features (
  id int primary key NOT NULL,
  product_id int NOT NULL,
  feature varchar(50) NOT NULL,
  type varchar(50),
  constraint fk_product
    foreign key(product_id)
      references products(id)
);

CREATE TABLE photos (
  id int NOT NULL,
  style_id int NOT NULL,
  url varchar(500000) NOT NULL,
  thumbnail varchar(500000) NOT NULL,
  constraint fk_style
    foreign key(style_id)
      references styles(id)
);

CREATE TABLE related (
  id int primary key NOT NULL,
  product_id int NOT NULL,
  related_id int NOT NULL,
  constraint fk_product
    foreign key(product_id)
      references products(id)
);

-- $ brew services start postgresql
-- $ psql postgres