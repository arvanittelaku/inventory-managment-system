const { User } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
//helper for generating token
const generateToken = (user) => {
    return jwt.sign(
        { user: { id: user.user_id, role: user.role } },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );
};

//register method
exports.registerUser = async (req, res) => {
    const { username, email, password, role } = req.body;

    try {
        let user = await User.findOne({ where: { email } });
        if (user) {
            return res.status(400).json({ message: 'User with that email already exists' });
        }

        user = await User.findOne({ where: { username } });
        if (user) {
            return res.status(400).json({ message: 'User with that username already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        user = await User.create({
            username,
            email,
            password_hash,
            role: role || 'user'
        });

        const token = generateToken(user);

        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
                id: user.user_id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error('Error during registerUser:', error);
        res.status(500).json({ message: 'Error registering user', error: error.message });
    }
};

//login method
exports.loginUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ where: { username } });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = generateToken(user);

        res.status(200).json({
            message: 'Logged in successfully',
            token,
            user: {
                id: user.user_id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error('Error during loginUser:', error);
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
};

exports.getMe = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: { exclude: ['password_hash'] }
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ message: 'Error fetching user profile', error: error.message });
    }
};


//get all users for admin user
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            where: {
                user_id: {
                    [Op.ne]: req.user.id //exlude the current user whose id matches req.user.id
                }
            },
            attributes: {exclude: ['password_hash']}
        });
        res.status(200).json(users);
    }catch(error){
        console.error('Error fetching all users:',error);
        res.status(500).json({message: 'Error fetching users',error:error.message});
    }
};