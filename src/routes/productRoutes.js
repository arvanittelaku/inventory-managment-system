const express = require('express');
const router = express.Router(); //we create a new router object
const productController = require('../controllers/productController');//we import the product controller
const authMiddleware = require('../middlewares/authMiddleware');
const authorizeRoles = require('../middlewares/authorizeRoles');
//we define routes and link them to the controller functions
router.get('/',authMiddleware,authorizeRoles(['admin,manager,user']),productController.getAllProducts);
router.get('/:id', authMiddleware, authorizeRoles(['admin', 'manager', 'user']), productController.getProductById);
router.post('/', authMiddleware, authorizeRoles(['admin', 'manager']), productController.createProduct);
router.put('/:id', authMiddleware, authorizeRoles(['admin', 'manager']), productController.updateProductById);
router.delete('/:id', authMiddleware, authorizeRoles(['admin']), productController.deleteProductById);

module.exports = router; //we export the router so we can import from other files