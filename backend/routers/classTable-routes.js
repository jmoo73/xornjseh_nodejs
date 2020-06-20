const express = require('express');
const router = express.Router();
const classTable = require('../controllers/classTable-controller');

router.post('/', classTable.classTableMaker);

module.exports = router;