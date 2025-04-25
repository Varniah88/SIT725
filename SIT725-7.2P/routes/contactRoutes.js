const express = require('express');
const router = express.Router();
const { submitForm } = require('../controllers/contactController');

router.post('/submit-form', submitForm);

module.exports = router;
