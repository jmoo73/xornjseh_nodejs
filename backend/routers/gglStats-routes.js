const express = require('express');
const router = express.Router();
const gglStats = require('../controllers/gglStats-controller');

router.post('/init', gglStats.init);

router.post('/submit', gglStats.submit);

router.post('/weekly-table', gglStats.weeklyTable);

module.exports = router;
