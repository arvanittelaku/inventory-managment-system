
const { AppError, BadRequestError } = require('../utils/appError'); 
const handleInvalidIdErrorDB = () => {
    return new BadRequestError('Invalid ID format provided.');
};

const handleDuplicateFieldsDB = err => {
    const match = err.message.match(/(["'])(\\?.)*?\1/);
    const value = match ? match[0] : 'unknown value';
    const message = `Duplicate field value: ${value}. Please use another value.`;
    return new BadRequestError(message);
};

const handleValidationErrorDB = err => {
    const errors = Object.values(err.errors).map(el => el.message);
    const message = `Invalid input data: ${errors.join('. ')}`;
    return new BadRequestError(message);
};

const handleJsonWebTokenError = () =>
    new AppError('Invalid token. Please log in again!', 401);

const handleTokenExpiredError = () =>
    new AppError('Your token has expired! Please log in again.', 401);

const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
    });
};

const sendErrorProd = (err, res) => {
   
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        });

        
    } else {
        
        console.error('ERROR', err);
        res.status(500).json({
            status: 'error',
            message: 'Something went very wrong!'
        });
    }
};


module.exports = (err, req, res, next) => {
    
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, res);
    } else if (process.env.NODE_ENV === 'production') {
        let error = { ...err }; 
        error.message = err.message; 

        
        if (error.name === 'SequelizeUniqueConstraintError') {
            error = handleDuplicateFieldsDB(error);
        }
        if (error.name === 'SequelizeValidationError') {
            error = handleValidationErrorDB(error);
        }
        
        if (error.name === 'SequelizeDatabaseError' && error.message.includes('invalid input syntax for type uuid')) {
             error = handleInvalidIdErrorDB();
        }
        if (error.name === 'JsonWebTokenError') {
            error = handleJsonWebTokenError();
        }
        if (error.name === 'TokenExpiredError') {
            error = handleTokenExpiredError();
        }

        sendErrorProd(error, res);
    }
};