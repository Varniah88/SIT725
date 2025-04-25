const express = require('express');
const router = express.Router();
const { fetchCards } = require('../controllers/cardController');

router.get('/', fetchCards);

module.exports = router;
