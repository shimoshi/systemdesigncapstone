const Pool = require('pg').Pool;
const config = require('./config.js');

const pool = new Pool({
  host: 'localhost',
  database: 'products',
  port: config.PORT,
});

const getProduct = () => {
  return pool.query(`SELECT * from products where id = 333`)
}

module.exports = {
  getProduct,
}