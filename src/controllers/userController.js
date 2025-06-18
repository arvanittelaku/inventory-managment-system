const { User } = require('../models') //we import the user model
const bcrypt = require('bcryptjs'); //bcrypt for hashing password
const jwt = require('jsonwebtoken'); //for creating jwts

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

