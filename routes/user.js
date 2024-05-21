const express = require('express');
const router = express.Router();

const { signup, verifyUser, approveUser, loginUser } = require('../controllers/user.js');

router.post('/signup', signup);
router.patch('/user/verify/:id', verifyUser)
router.patch('/user/approve/:id', approveUser)
router.post('/login', loginUser)

module.exports = router;
