const express = require('express');
const config = require('./config.js');
const queries = require('./queries.js');

let app = express();

app.use(express.json());

// 910 ms => 133 ms
app.get('/products', (req, res) => {
  let page = req.query.page || 1;
  let count = req.query.count || 5;

  queries.getAllProducts(page - 1, count)
    .then((results) => {
      results.rows.forEach((product) => {
        let new_default_price = Number(product.default_price);
        new_default_price += '' + '.00';
        product.default_price = new_default_price;
      })

      res.status(200).send(results.rows);
    })
    .catch((error) => {
      res.status(501).send(error);
    })
});

// 576 ms => 70 ms
app.get('/products/:id', (req, res) => {
  const { id } = req.params;
  const product = {};

  queries.getProduct(id)
    .then((results) => {
      result = results.rows[0];
      const { default_price } = result;

      let newDefaultPrice = Number(default_price);
      newDefaultPrice += '' + '.00';
      result.default_price = newDefaultPrice;

      res.status(200).send(result);
    })
    .catch((error) => {
      res.status(501).send(error);
    });
});

// 211886 ms => 50 ms
app.get('/products/:id/styles', (req, res) => {
  const { id } = req.params;
  const styles = {
    product_id: String(id),
    results: [],
  };

  queries.getStyles(id)
    .then((results) => {
      results.rows.forEach((style) => {
        const { id, name, original_price, sale_price, default_style, photos, skus } = style;

        let newOriginalPrice = Number(original_price);
        newOriginalPrice += '' + '.00';
        let newSalePrice = sale_price === 'null' ? null : sale_price;
        let newDefaultStye = default_style === '1' ? true : false;

        const newStyle = {
          style_id: id,
          name,
          original_price: newOriginalPrice,
          sale_price: newSalePrice,
          'default?': newDefaultStye,
          photos,
          skus,
        }

        styles.results.push(newStyle);
      })

      res.status(200).send(styles);
    })
    .catch((error) => {
      res.status(501).send(error);
    })
});

// 5770 ms => 81 ms
app.get('/products/:id/related', (req, res) => {
  const { id } = req.params;

  queries.getRelated(id)
    .then((results) => {
      const relatedIds = [];

      results.rows.forEach((relatedId) => {
        relatedIds.push(relatedId.related_id);
      })
      res.status(200).send(relatedIds);
    })
    .catch((error) => {
      res.status(501).send(error);
    })
});

const port = 2121;

app.listen(port, function () {
  console.log(`listening on port ${port}`);
});