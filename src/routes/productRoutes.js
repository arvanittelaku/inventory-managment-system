const express = require('express');
const router = express.Router(); //we create a new router object
const productController = require('../controllers/productController');//we import the product controller

//we define routes and link them to the controller functions
router.get('/',productController.getAllProducts);
router.get('/:id',productController.getProductById);
router.post('/',productController.createProduct);
router.put('/:id',productController.updateProductById);
router.delete('/:id',productController.deleteProductById);

module.exports = router; //we export the router so we can import from other files