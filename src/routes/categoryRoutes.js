const express = require('express');
const categoryRouter = express.Router(); //new router object
const categoryController = require('../controllers/categoryController'); //we import the category controller

//we define routes and link them with the controller functions
categoryRouter.get('/',categoryController.getAllCategories);
categoryRouter.get('/:id',categoryController.getCategoryById);
categoryRouter.post('/',categoryController.createCategory);
categoryRouter.put('/:id',categoryController.updateCategoryById);
categoryRouter.delete('/:id',categoryController.deleteCategoryById);

module.exports = categoryRouter;