const { User } = require('../models') //we import the user model
const bcrypt = require('bcryptjs'); //bcrypt for hashing password
const jwt = require('jsonwebtoken'); //for creating jwts

//method for registering user 
exports.registerUser = async (req,res) => {
    const {username,email,password,role} = req.body;

    try {
        //check if the user already exists by email or username
        let existingUser = await User.findOne({ where: { username } });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already taken' });
        }

        existingUser = await User.findOne({where: {email}} );
        if(existingUser) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        //hash the password
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password,salt);

        //create the user in the db
        const newUser = await User.create({
            username,
            email,
            password_hash,
            role:role || 'user'
        });

        //generate jwt token
        const payload = {
            user:{
                id:newUser.user_id,
                role:newUser.role
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            {expiresIn:'1h'},
            (err,token) => {
                if(err) throw err;
                res.status(201).json({
                    message: 'User registered successfully',
                    token, //send the token back
                    user:{
                         id: newUser.user_id,
                        username: newUser.username,
                        email: newUser.email,
                        role: newUser.role
                    } 
                });
            }
        );
    }catch(error) {
        console.error('Error registering user: ',error)
        res.status(500).json({ message: 'Server error during registration', error: error.message });
    }
};

//method for logging in 
exports.loginUser = async (req,res) => {
    const { username, password } = req.body;

    try {
        //check if user exists
        const user = await User.findOne({where: {username}});
        if(!user) {
            return res.status(400).json({message: 'Invalid credentials!'});
        }
        //compare provided password with hashed password in db
        const isMatch = await bcrypt.compare(password,user.password_hash);
        if(!isMatch) {
            return res.status(400).json({message: 'Invalid credentials!'});
        }

        //generate token
        const payload = {
            user: {
                id: user.user_id,
                role:user.role
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            {expiresIn: '1h'},
            (err,token) => {
                if(err) throw err;
                res.status(200).json({
                    message: 'Logged in successfully!',
                    token,
                    user: {
                        id:user.user_id,
                        username: user.username,
                        email:user.email,
                        role:user.role
                    }
                });
            }
        );
    }catch(error) {
        console.error('Error logging in user:', error);
        res.status(500).json({message: 'Server error during login',error:error.message})
    }
};

//method for getting the current logged in user's profile

exports.getMe = async (req,res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes:{exclude: ['password_hash']} //we exclude the password from the response
        });

        if(!user) {
            return res.status(404).json({message: 'User not found'});
        }

        res.status(200).json(user);
    }catch(error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({message: 'Server error fetching user profile', error:error.message});
    }
};

