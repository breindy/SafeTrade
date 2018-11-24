const express = require('express');
const models = require('../models');
const passport = require('../middlewares/auth');

const router = express.Router();
const User = models.User;

router.get('/error', (req, res, next) => {
  res.sendStatus(401);
})

router.post('/signup', (req,res) => {
  User.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    username: req.body.username,
    email: req.body.email,
    password_hash: req.body.password,
  }).then((user) => {
    res.json({ msg: "user created" });
  }).catch(() => {
    res.status(400).json({ msg: "error creating user" });
  });
});


router.post('/login',
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/auth/error' }),
  (req, res) => {
    // res.redirect('/dashboard');

    // res.json({
    //   id: req.user.id,
    //   firstName: req.user.firstName,
    //   lastName: req.user.lastName,
    //   email: req.user.email,

    //   message: '✅ Login Successful with the Correct Credentials!'
    // });
  });


router.get('/logout', (req, res) => {
  req.logout(); // passport created a nice logout function for us!
  res.sendStatus(200);
});


router.get('/auth/profile',
  passport.redirectIfNotLoggedIn('/auth/error'),
  (req, res) => {
    res.json({ msg: "This is the profile page for: " + req.user.email });
});



module.exports = router;
