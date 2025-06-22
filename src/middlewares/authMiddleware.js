const jwt = require('jsonwebtoken');
const { User } = require('../models'); 
const { UnauthorizedError, AppError } = require('../utils/appError'); 
const authMiddleware = async (req, res, next) => { 
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
        } catch (error) {
            console.error('Error parsing token from header:', error);
            return next(new UnauthorizedError('Not authorized, token format invalid.')); 
        }
    }

    if (!token) {
        return next(new UnauthorizedError('Not authorized, no token provided.')); 
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findByPk(decoded.id, {
            attributes: { exclude: ['password_hash'] }
        });

        if (!user) {
            return next(new UnauthorizedError('The user belonging to this token no longer exists.'));
        }

        req.user = user; 

        next();
    } catch (error) {
        console.error('Token verification failed:', error);
        if (error.name === 'TokenExpiredError') { 
            return next(new UnauthorizedError('Not authorized, token expired.')); 
        }
        return next(new UnauthorizedError('Not authorized, token invalid.')); 
    }
};

module.exports = authMiddleware;