// the request to this API is /stock?tickers=AAPL,GOOG,FB,...

const express = require('express');
const fetch = require('node-fetch');

const router = express.Router();

iexUrl = 'https://api.iextrading.com/1.0/stock/'

router.get('/test', (req, res) => {
  res.json({
    msg: "Successfully hit the stock page; send me the parameters!"
  });
});

router.get('/', (req, res) => {
  url = iexUrl + req.query.ticker + '/price';
  fetch(url)
    .then(response => response.text())
    .then(text => res.json({ price: text }))
});

router.get('/multiple', (req, res) => {
  prices = [];
  tickers = req.query.tickers.split(',');

  url = iexUrl + tickers[0] + '/price';
  fetch(url)
    .then(response => response.text())
    .then(text => prices.push(text))
    .then(() => { for(i=1; i<tickers.length; i++) {
        url = iexUrl + tickers[i] + '/price';
        fetch(url)
          .then(response => response.text())
          .then(text => prices.push(text))
    }})
    .then(() => res.json({ prices : prices }))
});

router.get('/error', (req, res) => {
  res.sendStatus(401);
});

module.exports = router;
