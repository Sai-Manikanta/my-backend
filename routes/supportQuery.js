const express = require('express');
const router = express.Router();
// const { verifyTokenMiddleware } = require('../middleware/verifyToken.js')

const { createSupportQuery } = require('../controllers/supportquery.js');

router.post('/', createSupportQuery);

module.exports = router;
