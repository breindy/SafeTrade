// This route is ignored for now until the demo night
// Instead, just a column name balance is added to users account
const express = require('express');
const models = require('../models');
const passport = require('../middlewares/auth');

const router = express.Router();
const Account = models.Account;

router.get('/error', (req, res) => {
  res.sendStatus(401);
})

router.post('/profile/investAccount',
  passport.redirectIfNotLoggedIn('/auth/error'),
  (req, res) => {
  Account.create({
    userName: req.body.username,
    email: req.body.email,
    balance: 10000,
  }).then((account) => {
    res.json({ msg: "An investment account created" });
  }).catch(() => {
    res.status(400).json({ msg: "error creating investment account" });
  });
});

module.exports = router;
