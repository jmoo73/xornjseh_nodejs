const express = require('express');
const router = express.Router();
const memberAuth = require('../controllers/memberAuth-controller');

router.post('/', memberAuth.memberAuth);

module.exports = router;
