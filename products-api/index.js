const express = require('express');

let app = express();

// app.use(express.static(__dirname + ''));

app.use(express.json());

app.get('/', (req, res) => {
  res.status(201).send('hey');
});

app.get('/products:id', (req, res) => {
  if (err) {
    res.status(501).send(err);
  } else {
    res.status(201).send('hey');
  }
});

const port = 2121;

app.listen(port, function() {
  console.log(`listening on port ${port}`);
});