const express = require('express');
const router = express.Router(); //new router object
const categoryController = require('../controllers/categoryController'); //we import the category controller
const authMiddleware = require('../middlewares/authMiddleware');
const authorizeRoles = require('../middlewares/authorizeRoles');
//we define routes and link them with the controller functions
router.get('/', authMiddleware, authorizeRoles(['admin', 'manager', 'user']), categoryController.getAllCategories);
router.get('/:id', authMiddleware, authorizeRoles(['admin', 'manager', 'user']), categoryController.getCategoryById);
router.post('/', authMiddleware, authorizeRoles(['admin', 'manager']), categoryController.createCategory);
router.put('/:id', authMiddleware, authorizeRoles(['admin', 'manager']), categoryController.updateCategoryById);
router.delete('/:id', authMiddleware, authorizeRoles(['admin']), categoryController.deleteCategoryById);

module.exports = router;