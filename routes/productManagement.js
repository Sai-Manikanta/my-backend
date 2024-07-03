const express = require('express');
const router = express.Router();
const { verifyTokenMiddleware } = require('../middleware/verifyToken.js')

const { getProductManagementData, updateProductManagementData } = require('../controllers/productManagement.js');

router.get('/', verifyTokenMiddleware, getProductManagementData);
router.patch('/', verifyTokenMiddleware, updateProductManagementData);


module.exports = router;
