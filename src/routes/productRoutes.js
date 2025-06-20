const express = require('express');
const productRouter = express.Router(); //we create a new router object
const productController = require('../controllers/productController');//we import the product controller

//we define routes and link them to the controller functions
productRouter.get('/',productController.getAllProducts);
productRouter.get('/:id',productController.getProductById);
productRouter.post('/',productController.createProduct);
productRouter.put('/:id',productController.updateProductById);
productRouter.delete('/:id',productController.deleteProductById);

module.exports = productRouter; //we export the router so we can import from other files