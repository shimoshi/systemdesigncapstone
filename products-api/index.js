const express = require('express');
const config = require('./config.js');
const queries = require('./queries.js');

let app = express();

// app.use(express.static(__dirname + ''));

app.use(express.json());

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

      res.status(200).send(results);
    })
    .catch((error) => {
      res.status(501).send(erorr);
    })
});

// 5.04s
app.get('/:campus/products/:id', (req, res) => {
  const { campus, id } = req.params;
  const product = {};

  queries.getProduct(id)
    .then((results) => {
      const {
        id,
        name,
        slogan,
        description,
        category,
        default_price,
      } = results.rows[0];

      let new_default_price = Number(default_price);
      new_default_price += '' + '.00';

      product.id = id;
      product.campus = campus;
      product.name = name;
      product.slogan = slogan;
      product.description = description;
      product.category = category;
      product.default_price = new_default_price;

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

      res.status(200).send(product);
    })
    .catch((error) => {
      res.status(501).send(error);
    });
});

// 1m 43s
app.get('/products/:id/styles', (req, res) => {
  const { id } = req.params;
  const styles = {};

  queries.getStyles(id)
    .then((results) => {
      styles.product_id = String(id);
      styles.results = [];
      const photosPromises = [];

      results.rows.forEach((style) => {
        const {  id, name, original_price, sale_price, default_style } = style;

        let final_sale_price = sale_price === 'null' ? null : sale_price;
        let final_default = default_style === '1' ? true : false;

        const newStyle = {
          style_id: id,
          name,
          original_price,
          sale_price: final_sale_price,
          'default?': final_default,
          photos: [],
          skus: {},
        };
        styles.results.push(newStyle);
        photosPromises.push(queries.getPhotos(id));
      })

      return Promise.all(photosPromises);
    })
    .then((results) => {
      const skusPromises = [];

      for (let i = 0; i < results.length; i += 1) {
        styles.results[i].photos = results[i].rows;
        skusPromises.push(queries.getSkus(styles.results[i].style_id))
      }

      return Promise.all(skusPromises);
    })
    .then((results) => {
      for (let i = 0; i < results.length; i += 1) {
        results[i].rows.forEach((sku) => {
          styles.results[i].skus[sku.id] = {
            quantity: sku.quantity,
            size: sku.size,
          };
        })
      }

      res.status(200).send(styles);
    })
    .catch((error) => {
      res.status(501).send(error);
    })
});

// 5.77s
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