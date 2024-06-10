const express = require('express');
const router = express.Router();

const { createSupportQuery } = require('../controllers/supportquery.js');

router.post('/', createSupportQuery);

module.exports = router;
