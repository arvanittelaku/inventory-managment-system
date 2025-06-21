const express = require('express');
const userRouter = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

//public routes
userRouter.post('/register',userController.registerUser);
userRouter.post('/login',userController.loginUser);

//private routes (auth required)
userRouter.get('/me',authMiddleware,userController.getMe);

module.exports = userRouter;