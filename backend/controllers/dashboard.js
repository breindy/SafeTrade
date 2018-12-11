const express = require('express');
const models = require('../models');
const router = express.Router();
const passport = require('../middlewares/auth');


const authCheck = (req, res, next) => {
    if(!req.user){
        res.redirect('/auth/login');
    }else {
        next();
    }
}

router.get('/', authCheck, function(req, res, next) {
    // res.send("Hello " + req.user.firstName + ", welcome to your dashboard!");
    res.json({
        message: 'Hello ' + req.user.firstName + ', welcome to your dashboard!'
    })
  });


module.exports = router;

