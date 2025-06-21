class AppError extends Error{
    constructor(message,statusCode) {
        super(message); //calls the parent error constructor with the message
        this.statusCode = statusCode;
        Error.captureStackTrace(this,this.constructor);
    }
}

//error for resources not found
class NotFoundError extends AppError{
    constructor(message = 'Resource not found') {
        super(message,404);
    }
}

//error for bad client request 
class BadRequestError extends AppError {
    constructor(message = 'Bad request') {
        super(message,400);
    }
}

//error for unauthorized requests (invalid token)
class UnauthorizedError extends AppError {
    constructor(message = 'Unauthorized') {
        super(message,401);
    }
}

//error for authorization failures (no permissions)
class ForbiddenError extends AppError {
    constructor(message = 'Access forbidden') {
        super(message, 403);
    }
}

module.exports = {
    AppError,
    NotFoundError,
    BadRequestError,
    UnauthorizedError,
    ForbiddenError
};



