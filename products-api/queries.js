const Pool = require('pg').Pool;
const config = require('./config.js');

const pool = new Pool({
  host: 'localhost',
  database: 'products',
  port: config.PORT,
});

const getAllProducts = (page, count) => {
  return pool.query(`
    EXPLAIN ANALYSE
    SELECT * FROM products
      LIMIT ${count}
      OFFSET ${page * count}
  `)
}

const getProduct = (id) => {
  return pool.query(`
    SELECT
      p.*,
      CASE WHEN count(f) = 0 THEN ARRAY[]::json[] ELSE array_agg(f.option) END AS features
    FROM products p
      LEFT OUTER JOIN
      (
        SELECT f1.product_id, json_build_object('feature', f1.feature, 'value', f1.value) as option
        FROM features f1
      ) f
        ON p.id = f.product_id
    WHERE p.id = ${id}
    GROUP BY p.id
  `)
}


const getFeatures = (id) => {
  return pool.query(`
    SELECT * FROM features WHERE product_id = ${id}
  `)
}

// 211886.681 ms
const getStyles = (id) => {
  return pool.query(`
    SELECT
      s.*,
      CASE WHEN count(p) = 0 THEN ARRAY[]::json[] ELSE array_agg(p.option) END AS photos,
      (select json_object_agg(id, json_build_object('size', size, 'quantity', quantity)) from skus where skus.style_id = s.id)
    FROM styles s
      LEFT JOIN
      (
        SELECT p1.style_id, json_build_object('thumbnail_url', p1.thumbnail_url, 'url', p1.url) as option
        FROM photos p1
      ) p
        ON s.id = p.style_id
      INNER JOIN skus sk on sk.style_id = s.id
    WHERE s.product_id = ${id}
    GROUP BY s.id
  `)
}

const getPhotos = (id) => {
  return pool.query(`
    SELECT thumbnail_url, url FROM photos WHERE style_id = ${id}
  `)
}

const getSkus = (id) => {
  // return pool.query(`
  //   SELECT id, quantity, size FROM skus WHERE style_id = ${id}
  // `)

  return pool.query(`
    select json_object_agg(id, json_build_object('size', size, 'quantity', quantity)) from skus where style_id = ${id}
  `)
}

const getRelated = (id) => {
  return pool.query(`
    SELECT related_id FROM related WHERE product_id = ${id}
  `)
}

module.exports = {
  getAllProducts,
  getProduct,
  getFeatures,
  getStyles,
  getPhotos,
  getSkus,
  getRelated,
}