const express = require('express');
const router = express.Router();

const { getProductManagementData, updateProductManagementData } = require('../controllers/productManagement.js');

router.get('/:userId', getProductManagementData);
router.patch('/:userId', updateProductManagementData);

module.exports = router;
