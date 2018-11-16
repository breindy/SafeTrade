const express = require('express');
const fetch = require('node-fetch');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    msg: "Successfully hit the root!"
  });
});

router.get('/error', (req, res) => {
  res.sendStatus(401);
})

router.get('/price', (req, res) => {
  fetch('https://api.iextrading.com/1.0/stock/GOOG/price')
    .then(response => response.text())
    .then(text => res.json({
      price: text
    }));
  });

module.exports = router;
