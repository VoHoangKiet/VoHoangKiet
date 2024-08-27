// middleware/authenticate.js
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const jwtSecret = 'QOFhms8CuIEQEGlOcBYuSFzjvPwxzCUFAUFfKQmSh8a14XZsf8ae9zOHs5LLuJ4D';

function generateToken(user) {
    let usernameFind = user.username;
    let userNew = User.findOne({ usernameFind });
    console.log(userNew.username);
    return jwt.sign({ id: userNew._id, username: userNew.username, role: userNew.role}, jwtSecret, { expiresIn: '1h' });
}

function decodeToken(token) {
    try {
        const decoded = jwt.decode(token);
        if (!decoded) {
            return { valid: false, user: null };
        }
        // Optionally, check if the token has expired
        const now = Date.now().valueOf() / 1000;
        if (typeof decoded.exp !== 'undefined' && decoded.exp < now) {
            return { valid: false, user: null, expired: true };
        }
        // Extract more user details if available
        const user = {
            username: decoded.username, 
            password: decoded.password, 
            role: decoded.role
        };
        return { valid: true, user: user };
    } catch (err) {
        return { valid: false, user: null, error: err };
    }
}


function checkRoleAdmin(user) {
    return "admin".toLowerCase().match(user.role.toLowerCase());
}

function authenticateJWT(req, res, next) {
    // Bypass authentication for specific routes (e.g., /auth/register, /auth/login)
    if (req.path === '/auth/register' || req.path === '/auth/login') {
        return next();
    }

    const token = req.header('Authorization')?.split(' ')[1];

    if (token) {
        jwt.verify(token, jwtSecret, (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: 'Token is not valid' });
            }
            req.user = decoded;
            next();
        });
    } else {
        res.status(401).json({ message: 'Access denied, token required' });
    }
}

module.exports = {
    generateToken,
    authenticateJWT,
    checkRoleAdmin,
    decodeToken
};
