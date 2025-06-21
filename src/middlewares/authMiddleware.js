const jwt = require('jsonwebtoken'); 

const authMiddleware = (req,res,next) => {
    //get the token from the header
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            //the format expected is like 'Bearer Token_String'
            token = req.headers.authorization.split(' ')[1]; //we get only the token
        }catch(error){
            console.error('Error parsing from the header:',error);
            return res.status(401).json({message: 'Not authorized, token format invalid'});
        }
    }
    //check if the token exists
    if(!token) {
        return res.status(401).json({message: 'Not authorized, no token' });
    }

    try {
        //verify token with jwt.verify - takes the token string and the secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        //atach the decoded user payload to the request object
        req.user = decoded.user; //req.user will have id and role

        next(); //call next to pass control to the next middleware or controller
    }catch(error) {
        console.error('Token verification failed:',error);
        //token invalid or expired
        if(error.name = 'TokenExpiredError') {
            return res.status(401).json({message: 'Not authorized,token expired'});
        }
        return res.status(401).json({message: 'Not authorized,token failed!'});
    }
};

module.exports = authMiddleware;