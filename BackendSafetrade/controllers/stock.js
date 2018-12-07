// Request to this API for single stock /stock?ticker=symbol
// And for multiple stoks is /stock/multiple?tickers=AAPL,GOOG,FB,...etc.

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

router.get('/multiple', async (req, res) => {
  prices = [];
  tickers = req.query.tickers.split(',');

  for(i=0; i<tickers.length; i++) {
    url = iexUrl + tickers[i] + '/price';
    await fetch(url)
    .then(response => response.text())
    .then(text => {
      prices.push(text);
    })
  }

  res.json({ prices : prices });
});

router.get('/error', (req, res) => {
  res.sendStatus(401);
});

module.exports = router;
