const express = require('express');
const router = express.Router();

<<<<<<< HEAD
//router.use('/alt', require('./alt'));
router.use('/auth', require('./auth'));
=======
>>>>>>> 5db6258f9f2628e96228db3f6eaec3fa05c8b59a
router.use('/', require('./home'));
router.use('/auth', require('./auth'));
router.use('/stock', require('./stock'));


module.exports = router;
