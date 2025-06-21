const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const authorizeRoles = require('../middlewares/authorizeRoles');
//public routes
router.post('/register',userController.registerUser);
router.post('/login',userController.loginUser);

//private routes (auth required)
router.get('/me',authMiddleware,userController.getMe);
router.get('/users',authMiddleware,authorizeRoles(['admin']),userController.getAllUsers);
module.exports = router;