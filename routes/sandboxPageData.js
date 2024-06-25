const express = require('express');
const router = express.Router();

const { createSandboxPageData, getSandboxPageData, updateSandboxData } = require('../controllers/sandboxPageData.js');

router.post('/', createSandboxPageData);
router.get('/:queryApi', getSandboxPageData);
router.patch('/responseParameters/:name', updateSandboxData);

module.exports = router;
