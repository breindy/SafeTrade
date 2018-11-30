const express = require('express');
const router = express.Router();

router.use('/', require('./home'));
router.use('/auth', require('./auth'));
router.use('/stock', require('./stock'));
router.use('/account', require('./account'));

module.exports = router;
