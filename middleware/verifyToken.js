const jwt = require('jsonwebtoken');
const User = require('../models/user');

const verifyTokenMiddleware = async (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(403).json({ error: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, "mylapay(.7~,ac4DeVI");

        const userDetails = await User.findById(decoded._id);

        if (!userDetails) {
            return res.status(404).json({ error: 'User not found' });
        }

        req.user = userDetails;

        next();
    } catch (err) {
        return res.status(500).json({ error: 'Failed to authenticate token' });
    }
};

module.exports = { verifyTokenMiddleware };
