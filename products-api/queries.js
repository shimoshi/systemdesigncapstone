const Pool = require('pg').Pool;
const config = require('./config.js');

const pool = new Pool({
  host: 'localhost',
  database: 'products',
  port: config.PORT,
});

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

module.exports = {
  getProduct,
  getFeatures,
}