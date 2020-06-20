const express = require('express');
const router = express.Router();
const gglThisYear = require('../controllers/gglThisYear-controller');

router.post('/init-persons', gglThisYear.initPersons);

router.post('/update-persons', gglThisYear.updatePersons);

router.post('/save-testees', gglThisYear.saveTestees);

router.post('/personal-attendance', gglThisYear.personalAttendance);

router.post('/add-new-member', gglThisYear.addNewMember);

module.exports = router;
