// src/controllers/categoryController.js
const { Category, User } = require('../models'); // Import User model
const { NotFoundError, BadRequestError, ForbiddenError, AppError } = require('../utils/appError');

// Get all categories
exports.getAllCategories = async (req, res, next) => {
    try {
        const categories = await Category.findAll({
            include: [
                {
                    model: User,
                    as: 'CreatedBy',
                    attributes: { exclude: ['password_hash', 'passwordChangedAt', 'passwordResetToken', 'passwordResetExpires'] } // Exclude password_hash
                },
                {
                    model: User,
                    as: 'UpdatedBy',
                    attributes: { exclude: ['password_hash', 'passwordChangedAt', 'passwordResetToken', 'passwordResetExpires'] } // Exclude password_hash
                }
            ]
        });
        res.status(200).json({
            status: 'success',
            results: categories.length,
            categories,
        });
    } catch (error) {
        next(new AppError('Failed to fetch categories. ' + error.message, 500));
    }
};

// Get category by ID
exports.getCategoryById = async (req, res, next) => {
    try {
        const category = await Category.findByPk(req.params.id, {
            include: [
                {
                    model: User,
                    as: 'CreatedBy',
                    attributes: { exclude: ['password_hash', 'passwordChangedAt', 'passwordResetToken', 'passwordResetExpires'] } // Exclude password_hash
                },
                {
                    model: User,
                    as: 'UpdatedBy',
                    attributes: { exclude: ['password_hash', 'passwordChangedAt', 'passwordResetToken', 'passwordResetExpires'] } // Exclude password_hash
                }
            ]
        });
        if (!category) {
            return next(new NotFoundError('Category not found!'));
        }
        res.status(200).json({
            status: 'success',
            category,
        });
    } catch (error) {
        if (error.name === 'SequelizeInvalidUUIDError' || error.name === 'SequelizeDatabaseError') {
            return next(new BadRequestError('Invalid category ID format.'));
        }
        next(new AppError('Failed to fetch category. ' + error.message, 500));
    }
};

// Create new category
exports.createCategory = async (req, res, next) => {
    try {
        if (!req.user || !req.user.user_id) {
            return next(new ForbiddenError('User not authenticated for creation.'));
        }
        const { name, description } = req.body;

        if (!name) {
            return next(new BadRequestError('Category name is required.'));
        }

        // Automatically assign created_by_user_id and updated_by_user_id from the authenticated user
        const newCategoryData = {
            ...req.body, // Take 'name' and 'description' from the request body
            created_by_user_id: req.user.user_id, // Set creator from authenticated user
            updated_by_user_id: req.user.user_id  
        };

        const newCategory = await Category.create(newCategoryData);
        res.status(201).json({
            status: 'success',
            category: newCategory,
        }); 
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return next(new BadRequestError('Category with this name already exists.'));
        }
        if (error.name === 'SequelizeValidationError') {
            const messages = error.errors.map(err => err.message);
            return next(new BadRequestError(`Validation error: ${messages.join(', ')}`));
        }
        next(new AppError('Error creating category! ' + error.message, 500));
    }
};

// Update category by ID
exports.updateCategoryById = async (req, res, next) => {
    try {
        if (!req.user || !req.user.user_id) {
            return next(new ForbiddenError('User not authenticated for update.'));
        }
        const categoryId = req.params.id;
        const { name, description } = req.body;

        const category = await Category.findByPk(categoryId);
        if (!category) {
            return next(new NotFoundError('Category not found!'));
        }

        // Ensure at least one field is provided for update
        if (!name && !description) {
            return next(new BadRequestError('Please provide at least a name or description to update.'));
        }
        
        const updatedCategoryData = { 
            name: name || category.name,
            description: description || category.description,
            updated_by_user_id: req.user.user_id // Set updater to the user performing the update 
        }; 

        await category.update(updatedCategoryData);

        const updatedCategory = await Category.findByPk(req.params.id, { 
            include: [ 
                { 
                    model: User, 
                    as: 'CreatedBy', 
                    attributes: { exclude: ['password_hash', 'passwordChangedAt', 'passwordResetToken', 'passwordResetExpires'] } 
                }, 
                { 
                    model: User, 
                    as: 'UpdatedBy', 
                    attributes: { exclude: ['password_hash', 'passwordChangedAt', 'passwordResetToken', 'passwordResetExpires'] } 
                } 
            ] 
        }); 
        res.status(200).json({
            status: 'success',
            category: updatedCategory,
        });
    } catch (error) {
        if (error.name === 'SequelizeInvalidUUIDError' || error.name === 'SequelizeDatabaseError') {
            return next(new BadRequestError('Invalid category ID format.'));
        }
        if (error.name === 'SequelizeUniqueConstraintError') {
            return next(new BadRequestError('Category with this name already exists.'));
        }
        if (error.name === 'SequelizeValidationError') {
            const messages = error.errors.map(err => err.message);
            return next(new BadRequestError(`Validation error: ${messages.join(', ')}`));
        }
        next(new AppError('Error updating the category. ' + error.message, 500));
    }
};

// Delete category by ID
exports.deleteCategoryById = async (req, res, next) => {
    try {
        const categoryId = req.params.id;
        const category = await Category.findByPk(categoryId); 

        if (!category) {
            return next(new NotFoundError('Category not found!'));
        }

        await category.destroy(); 

        res.status(204).json({ //no content
            status: 'success',
            data: null
        }); 
    } catch (error) {
        if (error.name === 'SequelizeInvalidUUIDError' || error.name === 'SequelizeDatabaseError') {
            return next(new BadRequestError('Invalid category ID format.'));
        }
        next(new AppError('Failed to delete category. ' + error.message, 500));
    }
};