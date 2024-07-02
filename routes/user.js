const express = require('express');
const router = express.Router();
const { verifyTokenMiddleware } = require('../middleware/verifyToken.js')

const { 
    signup, 
    verifyUser, 
    approveUser, 
    loginUser, 
    verifySandboxAccess, 
    getMyDetails, 
    resetPassword, 
    forgotPassword, 
    generatePassword, 
    updateProfileData, 
    getProfileChanges, 
    approveChanges 
} = require('../controllers/user.js');

router.post('/signup', signup);
router.patch('/user/verify/:id', verifyUser)
router.patch('/user/approve/:id', approveUser)
router.post('/user/get-my-data', verifyTokenMiddleware, getMyDetails)
router.post('/login', loginUser)
router.post('/verify-sandbox-access', verifyTokenMiddleware, verifySandboxAccess)
router.post('/user/generate-password/:token', generatePassword)
router.post('/user/reset-password/:token', resetPassword)
router.post('/forgot-password', forgotPassword)
router.patch('/update-profile', verifyTokenMiddleware, updateProfileData)
router.get('/profile-changes/:userId', getProfileChanges)
router.patch('/approve-profile-changes/:userId', approveChanges)

module.exports = router;
