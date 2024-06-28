const express = require('express');
const router = express.Router();
const { verifyTokenMiddleware } = require('../middleware/verifyToken.js')

const { signup, verifyUser, approveUser, loginUser, verifySandboxAccess, getMyDetails, resetPassword, forgotPassword, generatePassword, updateProfileData } = require('../controllers/user.js');

router.post('/signup', signup);
router.patch('/user/verify/:id', verifyUser)
router.patch('/user/approve/:id', approveUser)
router.post('/user/get-my-data', verifyTokenMiddleware, getMyDetails)
router.post('/login', loginUser)
router.post('/verify-sandbox-access', verifyTokenMiddleware, verifySandboxAccess)
router.post('/user/generate-password/:token', generatePassword)
router.post('/user/reset-password/:token', resetPassword)
router.post('/forgot-password', forgotPassword)
router.patch('/profile-update', verifyTokenMiddleware, updateProfileData)

module.exports = router;
