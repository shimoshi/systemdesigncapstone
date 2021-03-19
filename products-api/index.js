const express = require('express');
const config = require('./config.js');
const queries = require('./queries.js');

let app = express();

// app.use(express.static(__dirname + ''));

app.use(express.json());

app.get('/', (req, res) => {
  res.status(201).send('hey');
});

app.get('/products/:id', (req, res) => {
  const { id } = req.params;
  const product = {};

  queries.getProduct(id)
    .then((results) => {
      const {
        id,
        name,
        slogan,
        description,
        category,
        default_price
      } = results.rows[0];

      product.id = id;
      product.name = name;
      product.slogan = slogan;
      product.description = description;
      product.category = category;
      product.default_price = default_price;

      return queries.getFeatures(id);
    })
    .then((results) => {
      product.features = [];

      results.rows.forEach((feature) => {
        product.features.push({
          feature: feature.feature,
          value: feature.type,
        })
      });

      res.status(201).send(product);
    })
    .catch((error) => {
      res.status(501).send(error);
    });
});

app.get('/products/:id/styles', (req, res) => {
  res.status(201).send('styles');
});

app.get('/products/:id/related', (req, res) => {
  res.status(201).send('related');
});

const port = 2121;

app.listen(port, function () {
  console.log(`listening on port ${port}`);
});