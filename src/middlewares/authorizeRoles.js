
const authorizeRoles = (allowedRoles) => {
    return (req,res,next) => {
        //check if req.user exists (authMiddleware has run)
        if(!req.user || !req.user.role) {
            return res.status(401).json({message: 'Not authenticated or user not found!'});
        }

        const userRole = req.user.role;
        

        //check if the user role is included in the allowed roles array
        if (allowedRoles.includes(userRole)) {
            next(); //user is authorized so we proceed to the next middleware
        }else {
            //user is not authorized!
            res.status(403).json({messgae:'Forbidden: You do not have the necessary permissions'});
        }
    };
};

module.exports = authorizeRoles;