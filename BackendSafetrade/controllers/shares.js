const express = require('express');
const router = express.Router();

const fetch = require('node-fetch');

const bcrypt = require('bcrypt-nodejs');
const Shares = require('../models').Shares;

iexUrl = 'https://api.iextrading.com/1.0/stock/'

router.get('/shares', (req, res) => {
  username = req.query.username;
  (username) => { Shares.findAll({
    where: { username: username},
    attributes: ['symbol']
  }).then(symbols => {
    res.json({allSymbols: symbols})
  })
}
});

router.get('/error', (req, res) => {
  res.sendStatus(401);
});

module.exports = router;
