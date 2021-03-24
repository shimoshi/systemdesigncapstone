const Pool = require('pg').Pool;
const config = require('./config.js');

const pool = new Pool({
  host: 'localhost',
  database: 'products',
  port: config.PORT,
});

// planning: 13.5 ms
// execution: 2.9 ms
const getAllProducts = (page, count) => {
  return pool.query(`
    SELECT * FROM products
      LIMIT ${count}
      OFFSET ${page * count}
  `)
}

// planning: 12.8 ms
// execution: 2.5 ms
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

// planning: 0.3 ms
// execution: 8.4 ms
const getStyles = (id) => {
  return pool.query(`
    SELECT
      s.*,
      p.photos as photos,
      sk.skus as skus
    FROM styles s
      LEFT JOIN LATERAL
      (
        SELECT array_agg(json_build_object('thumbnail_url', p1.thumbnail_url, 'url', p1.url)) as photos
        FROM photos p1
        WHERE s.id = p1.style_id
      ) p on true
      LEFT JOIN LATERAL
      (
        SELECT json_object_agg(sk1.id, json_build_object('quantity', sk1.quantity, 'size', sk1.size)) as skus
        FROM skus sk1
        WHERE s.id = sk1.style_id
      ) sk on true
    WHERE s.product_id = ${id}
  `)
}

// planning: 5.6 ms
// execution: 1.5 ms
const getRelated = (id) => {
  return pool.query(`
    SELECT related_id FROM related WHERE product_id = ${id}
  `)
}

module.exports = {
  getAllProducts,
  getProduct,
  getStyles,
  getRelated,
}