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
  // const { id } = req.params;

  queries.getProduct()
    .then((results) => {
      res.status(201).send(results);
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