const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function(req, res, next) {
    // Get token from header
    const token = req.header('x-auth-token');

    // Check if not token
    // Status 401 means 'not authorized'
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    // if there is token, then Verify token by decoding it
    try {
        const decoded = jwt.verify(token, config.get('jwtSecret'));

        req.user = decoded.user;   // .user (remember we attached user, user.id in the payload inside users.js)
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};
