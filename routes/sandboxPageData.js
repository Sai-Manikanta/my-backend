const express = require('express');
const router = express.Router();

const { createSandboxPageData, getSandboxPageData } = require('../controllers/sandboxPageData.js');

router.post('/', createSandboxPageData);
router.get('/:queryApi', getSandboxPageData);

module.exports = router;
