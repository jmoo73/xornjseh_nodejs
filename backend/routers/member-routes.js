const express = require('express');
const router = express.Router();
const member = require('../controllers/member-controller');

router.post('/auth', member.auth);
router.post('/init-member', member.initMember)
router.post('/check-in', member.checkIn);
router.post('/fetch-attdata', member.fetchAttData);

module.exports = router;
