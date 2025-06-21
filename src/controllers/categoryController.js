// src/controllers/categoryController.js
const { Category, User } = require('../models'); // Import User model

// Get all categories
exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Category.findAll({
            include: [
                {
                    model: User,
                    as: 'CreatedBy',
                    attributes: { exclude: ['password_hash'] } // Exclude password_hash
                },
                {
                    model: User,
                    as: 'UpdatedBy',
                    attributes: { exclude: ['password_hash'] } // Exclude password_hash
                }
            ]
        });
        res.status(200).json(categories);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ message: 'Error fetching categories', error: error.message });
    }
};

// Get category by ID
exports.getCategoryById = async (req, res) => {
    try {
        const category = await Category.findByPk(req.params.id, {
            include: [
                {
                    model: User,
                    as: 'CreatedBy',
                    attributes: { exclude: ['password_hash'] } // Exclude password_hash
                },
                {
                    model: User,
                    as: 'UpdatedBy',
                    attributes: { exclude: ['password_hash'] } // Exclude password_hash
                }
            ]
        });
        if (category) {
            res.status(200).json(category);
        } else {
            res.status(404).json({ message: 'Category not found!' });
        }
    } catch (error) {
        console.error('Error fetching category by ID:', error);
        res.status(500).json({ message: 'Error fetching category', error: error.message });
    }
};

// Create new category
exports.createCategory = async (req, res) => {
    try {
        // Automatically assign created_by_user_id and updated_by_user_id from the authenticated user
        const newCategoryData = {
            ...req.body, // Take 'name' and 'description' from the request body
            created_by_user_id: req.user.id, // Set creator from authenticated user
            updated_by_user_id: req.user.id  
        };

        const newCategory = await Category.create(newCategoryData);
        res.status(201).json(newCategory); 
    } catch (error) {
        console.error('Error creating category:', error);
        res.status(400).json({ message: 'Error creating category!', error: error.message });
    }
};

// Update category by ID
exports.updateCategoryById = async (req, res) => {
    try {
        
        const updatedCategoryData = {
            ...req.body, // Take 'name' and 'description' from the request body
            updated_by_user_id: req.user.id // Set updater to the user performing the update
        };

        const [updatedRows] = await Category.update(updatedCategoryData, {
            where: { category_id: req.params.id }
        });

        if (updatedRows > 0) {
            const updatedCategory = await Category.findByPk(req.params.id, {
                include: [
                    {
                        model: User,
                        as: 'CreatedBy',
                        attributes: { exclude: ['password_hash'] }
                    },
                    {
                        model: User,
                        as: 'UpdatedBy',
                        attributes: { exclude: ['password_hash'] }
                    }
                ]
            });
            res.status(200).json(updatedCategory);
        } else {
            res.status(404).json({ message: 'Category not found!' });
        }
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: 'Error updating the category', error: error.message });
    }
};

// Delete category by ID
exports.deleteCategoryById = async (req, res) => {
    try {
        const deletedRows = await Category.destroy({
            where: { category_id: req.params.id }
        });
        if (deletedRows > 0) {
            res.status(204).send(); 
        } else {
            res.status(404).json({ message: 'Category not found!' });
        }
    } catch (error) {
        console.error('Error deleting category:', error);
        res.status(500).json({ message: 'Error deleting category', error: error.message });
    }
};