const { User } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const { BadRequestError, AppError, UnauthorizedError } = require('../utils/appError');
const e = require('express');
//helper for generating token
const generateToken = (id) => {
    return jwt.sign(
        { id },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );
};

//register method
exports.registerUser = async (req, res,next) => {
    const { username, email, password } = req.body;

    try {
        if(!username || !email || !password) {
            return next(new BadRequestError('Please provide username, email and password'));
        }
        //check if user already exists by email
        let userExists = User.findOne({ where: {email}});
        if(userExists) {
            return next(new BadRequestError('Email already taken!'));
        }
        //check if user exists by username
        userExists = User.findOne({where: {username}});
        if(userExists) {
            return next(new BadRequestError('Username already taken!'));
        }

        //hash the password
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            username,
            email,
            password_hash,
            role:'user' //default 
        });

        const token = generateToken(newUser.user_id);

        res.status(201).json({
            status: 'success',
            token,
              user: {
                user_id: newUser.user_id,
                username: newUser.username,
                email: newUser.email,
                role: newUser.role
            }
        });
    }catch(error) {

        next(new AppError('Failed to register user.' + error.message, 500));
    }
};

//login method
exports.loginUser = async (req, res, next) => {
    const { username, password } = req.body;

    try {
        if(!username || !password) {
            return next(new BadRequestError('Please provide username and password.'));
        }
        const user = await User.findOne({where: {username}});

        if(!user) {
            return next(new UnauthorizedError('Invalid credentials.'))
        }

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if(!isMatch) {
            return next(new BadRequestError('Invalid password.'));
        }

        const token = generateToken(user.user_id);
        res.status(200).json({
            status: 'success',
            token,
            user: {
                user_id: user.user_id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    }catch(error) {
        next(new AppError('Failed to log in. ' + error.message + 500));
    }
};

exports.getMe = async (req, res, next) => {
    try {
       
        if (!req.user) {
            return next(new UnauthorizedError('User not authenticated.'));
        }

        res.status(200).json({
            status: 'success',
            user: {
                user_id: req.user.user_id,
                username: req.user.username,
                email: req.user.email,
                role: req.user.role
            }
        });
    } catch (error) {
        next(new AppError('Failed to fetch user profile. ' + error.message, 500));
    }
};

//get all users for admin
exports.getAllUsers = async (req, res, next) => { 
    try {
        const users = await User.findAll({
            attributes: { exclude: ['password_hash'] }
        });
        res.status(200).json({
            status: 'success',
            results: users.length,
            users
        });
    } catch (error) {
        next(new AppError('Failed to fetch users. ' + error.message, 500));
    }
};
