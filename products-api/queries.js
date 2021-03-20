const Pool = require('pg').Pool;
const config = require('./config.js');

const pool = new Pool({
  host: 'localhost',
  database: 'products',
  port: config.PORT,
});

const getAllProducts = (page, count) => {
  return pool.query(`
    SELECT * FROM products
      LIMIT ${count}
      OFFSET ${page * count}
  `)
}

const getProduct = (id) => {
  return pool.query(`
    SELECT * FROM products WHERE id = ${id}
      LIMIT 1
  `)
}

const getFeatures = (id) => {
  return pool.query(`
    SELECT * FROM features WHERE product_id = ${id}
  `)
}

const getStyles = (id) => {
  return pool.query(`
    SELECT * FROM styles WHERE product_id = ${id}
  `)
}

const getPhotos = (id) => {
  return pool.query(`
    SELECT thumbnail_url, url FROM photos WHERE style_id = ${id}
  `)
}

const getSkus = (id) => {
  return pool.query(`
    SELECT id, quantity, size FROM skus WHERE style_id = ${id}
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