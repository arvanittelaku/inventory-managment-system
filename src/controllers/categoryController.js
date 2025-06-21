const { Category } = require('../models'); //we import the category model

//get all the categories
exports.getAllCategories = async (req,res) => {
    try {
        const categories = await Category.findAll();
        res.status(200).json(categories);
    }catch(error){
        console.error('Error fetching categories:',error);
        res.status(500).json({message: 'Error fetching categories',error:error.message});
    }
};

//get category by id
exports.getCategoryById = async (req,res) => {
    try{
        const category = await Category.findByPk(req.params.id);
        if(category) {
            res.status(200).json(category);
        }else{
            res.status(404).json({message: 'Category not found!'});
        }
    }catch(error) {
        console.error('Error fetching category by ID:',error);
        res.status(500).json({message: 'Error fetching category',error:error.message});
    }
};

//create new category
exports.createCategory = async (req,res) => {
    try {
        const newCategory = await Category.create(req.body);
        res.status(201).json(newCategory,{message:'Category created successfully!'});
    }catch(error){
        console.error('Error creating category:',error);
        res.status(500).json({message: 'Error creating category!',error:error.message});
    }
};

//update category by id
exports.updateCategoryById = async (req,res) => {
    try{
        const [updatedRows] = await Category.update(req.body,{
            where: {category_id: req.params.id}
        });
        if(updatedRows > 0) {
            const updatedCategory = await Category.findByPk(req.params.id);
            res.status(200).json(updatedCategory);
        }else {
            res.status(404).json({ message: 'Category not found or no changes were made!' });
        }
    }catch(error){
        console.error('Error updating category:', error);
        res.status(500).json({message: 'Error updating category', error:error.message});
    }
};

//delete category by id
exports.deleteCategoryById = async (req,res) => {
    try {
        const deleted = Category.destroy({
            where: {category_id:req.params.id}
        });
        if(deleted) {
            res.status(204).send(); //no content sent
        }else {
            res.status(404).json({message: 'Category not found!'});
        }
    }catch(error) {
        console.error('Error deleting category:', error);
        res.status(500).json({message: 'Error deleting category',error: error.message});
    }
};