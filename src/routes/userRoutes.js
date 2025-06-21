const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

//public routes
router.post('/register',userController.registerUser);
router.post('/login',userController.loginUser);

//private routes (auth required)
router.get('/me',authMiddleware,userController.getMe);

module.exports = router;