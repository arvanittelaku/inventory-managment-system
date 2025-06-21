const express = require('express');
const router = express.Router(); //new router object
const categoryController = require('../controllers/categoryController'); //we import the category controller

//we define routes and link them with the controller functions
router.get('/',categoryController.getAllCategories);
router.get('/:id',categoryController.getCategoryById);
router.post('/',categoryController.createCategory);
router.put('/:id',categoryController.updateCategoryById);
router.delete('/:id',categoryController.deleteCategoryById);

module.exports = router;