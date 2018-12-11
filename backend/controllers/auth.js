const express = require('express');
const models = require('../models');
const passport = require('../middlewares/auth');

const router = express.Router();
const User = models.User;

router.get('/error', (req, res, next) => {
  res.sendStatus(401)
  .json({
    message: '🚫 Oops, an error occured! 🚫'
  })
})

//@route POST api/auth/signup
//@desc Register user to the database
//@access Public
router.post('/signup', (req,res) => {
  const { errors, isValid } = validateSignupInput(req.body);

  //Check Validation
  if (!isValid){
    return res.status(400).json(errors);
  }

  User.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    username: req.body.username,
    email: req.body.email,
    balance: req.body.balance,
    password_hash: req.body.password,
  }).then((user) => {
    res.json({ msg: "user created" });
  }).catch(() => {
    res.status(400).json({ msg: "error creating user" });
  });
});

//     successRedirect: '/dashboard',

router.post('/login',
  passport.authenticate('local', {
    failureRedirect: '/auth/error' }),
  (req, res) => {
    // res.redirect('/dashboard');

    res.json({
      id: req.user.id,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      email: req.user.email,

      message: '✅ Login Successful with the Correct Credentials!'
    });

  });

  router.get('/whoAmI',
  (req, res) => {
    res.json({
      id: req.user.id,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      email: req.user.email,

      message: '✅ User Identified'
    });
    // res.writeHead(200, {'Content-Type': 'application/json'});
    // var validCredentials = {
    //   firstName: req.user.firstName,
    //   lastName: req.user.lastName,
    //   username: req.user.username,
    //   email: req.user.email,
    // };
    // res.end(JSON.stringify(validCredentials))
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
