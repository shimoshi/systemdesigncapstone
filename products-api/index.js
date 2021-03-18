const express = require('express');

let app = express();

// app.use(express.static(__dirname + ''));

app.use(express.json());

app.get('/', (req, res) => {
  res.status(201).send('hey');
});

app.get('/products/:id', (req, res) => {
  res.status(201).send('products');
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