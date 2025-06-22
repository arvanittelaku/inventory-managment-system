const { Product, Category, User } = require('../models'); //import models
const { NotFoundError, BadRequestError, ForbiddenError, AppError } = require('../utils/appError');

//get all the products
exports.getAllProducts = async (req,res,next) => {
      try{
        const products = await Product.findAll({
            include: [
                {model:Category, attributes: ['category_id', 'name']},
                {
                    model:User,
                    as:'createdBy',
                    attributes: { exclude: ['password_hash'] } //exlude the password hashed
                },
                {
                    model:User,
                    as:'updatedBy',
                    attributes: { exclude: ['password_hash'] } //exlude the password hashed
                }
            ]
        });
        res.status(200).json({
            status: 'success',
            results: products.length,
            products,
        });
    }catch(error) {
        next(new AppError('Failed to fetch products. ' + error.message, 500));
    }
};

//get product by id
exports.getProductById = async (req,res,next) => {
    try {
       const product = await Product.findByPk(req.params.id, {
       include: [
                {model:Category, attributes: ['category_id', 'name']},
                {
                    model:User,
                    as:'createdBy',
                    attributes: { exclude: ['password_hash'] } //exlude the password hashed
                },
                {
                    model:User,
                    as:'updatedBy',
                    attributes: { exclude: ['password_hash'] } //exlude the password hashed
                }
            ]
       });
       if(!product) {
        return next(new NotFoundError('Product not found!'));
       }
       res.status(200).json({
            status: 'success',
            product,
        });
    }catch(error) {
        if (error.name === 'SequelizeInvalidUUIDError' || error.name === 'SequelizeDatabaseError') {
            return next(new BadRequestError('Invalid product ID format.'));
        }
        next(new AppError('Failed to fetch product. ' + error.message, 500));
    }
};

//update product by id
exports.updateProductById = async (req,res,next) => {
   try {
    if (!req.user || !req.user.user_id) {
        return next(new ForbiddenError('User not authenticated for update.'));
    }
    const productId = req.params.id;
    const { name, description, price, stock, category_id } = req.body;

    const product = await Product.findByPk(productId);
    if(!product) {
        return next(new NotFoundError('Product not found!'));
    }

    if (category_id) {
        const category = await Category.findByPk(category_id);
        if (!category) {
            return next(new BadRequestError('Invalid category_id: Category does not exist.'));
        }
    }

    await product.update({
        name: name || product.name,
        description: description || product.description,
        price: price || product.price,
        stock: stock || product.stock,
        category_id: category_id || product.category_id,
        updated_by_user_id: req.user.user_id,
        updatedAt: new Date(),
    });

        const updatedProduct = await Product.findByPk(req.params.id, {
            include: [
                {model:Category, attributes: ['category_id', 'name']},
                {
                    model:User,
                    as:'createdBy',
                    attributes: { exclude: ['password_hash'] } //exlude the password hashed
                },
                {
                    model:User,
                    as:'updatedBy',
                    attributes: { exclude: ['password_hash'] } //exlude the password hashed
                }
            ]
        });
        res.status(200).json({
            status: 'success',
            product: updatedProduct,
        });
   }catch(error) {
    if (error.name === 'SequelizeInvalidUUIDError' || error.name === 'SequelizeDatabaseError') {
        return next(new BadRequestError('Invalid product ID format.'));
    }
    if (error.name === 'SequelizeUniqueConstraintError') {
        return next(new BadRequestError('Product with this name already exists.'));
    }
    if (error.name === 'SequelizeValidationError') {
        const messages = error.errors.map(err => err.message);
        return next(new BadRequestError(`Validation error: ${messages.join(', ')}`));
    }
    next(new AppError('Failed to update product. ' + error.message, 500));
   }
};

//create new product
exports.createProduct = async (req,res,next) => {
    try {
        if (!req.user || !req.user.user_id) {
            return next(new ForbiddenError('User not authenticated for creation.'));
        }
        const { name, description, price, stock, category_id } = req.body;

        if (!name || !price || !stock || !category_id) {
            return next(new BadRequestError('Please provide name, price, stock, and category_id.'));
        }

        const category = await Category.findByPk(category_id);
        if (!category) {
            return next(new BadRequestError('Invalid category_id: Category does not exist.'));
        }

        const newProductData = {
            ...req.body, //take all the fields from the body
            created_by_user_id:req.user.user_id,
            updated_by_user_id:req.user.user_id
        };

        const newProduct = await Product.create(newProductData);

        const createdProduct = await Product.findByPk(newProduct.product_id, {
            include: [
                {model:Category, attributes: ['category_id', 'name']},
                {
                    model:User,
                    as:'createdBy',
                    attributes: { exclude: ['password_hash'] } //exlude the password hashed
                },
                {
                    model:User,
                    as:'updatedBy',
                    attributes: { exclude: ['password_hash'] } //exlude the password hashed
                }
            ]
        });

        res.status(201).json({
            status: 'success',
            product: createdProduct,
        });
    }catch(error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return next(new BadRequestError('Product with this name already exists.'));
        }
        if (error.name === 'SequelizeValidationError') {
            const messages = error.errors.map(err => err.message);
            return next(new BadRequestError(`Validation error: ${messages.join(', ')}`));
        }
        next(new AppError('Failed to create product. ' + error.message, 500));
    }
};

//delete a product by id
exports.deleteProductById = async (req,res,next) => {
    try {
        const productId = req.params.id;
        const product = await Product.findByPk(productId);

        if (!product) {
            return next(new NotFoundError('Product not found!'));
        }

        await product.destroy();

        res.status(204).json({ //no content
            status: 'success',
            data: null
        });
    }catch(error) {
        if (error.name === 'SequelizeInvalidUUIDError' || error.name === 'SequelizeDatabaseError') {
            return next(new BadRequestError('Invalid product ID format.'));
        }
        next(new AppError('Failed to delete product. ' + error.message, 500));
    }
};