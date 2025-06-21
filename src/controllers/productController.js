const { Product, Category, User } = require('../models') //import models

//get all the products
exports.getAllProducts = async (req,res) => {
      try{
        const products = await Product.findAll({
            include: [
                {model:Category},
                {
                    model:User,
                    as:'CreatedBy',
                    attributes: { exclude: ['password_hash'] } //exlude the password hashed
                },
                {
                    model:User,
                    as:'UpdatedBy',
                    attributes: { exclude: ['password_hash'] } //exlude the password hashed
                }
            ]
        });
        res.status(200).json(products);
    }catch(error) {
        console.error('Error fetching products: ',error);
        res.status(500).json({message:'Error fetching products',error:error.message});
    }
};

//get product by id
exports.getProductById = async (req,res) => {
    try {
       const product = await Product.findByPk(req.params.id, {
       include: [
                {model:Category},
                {
                    model:User,
                    as:'CreatedBy',
                    attributes: { exclude: ['password_hash'] } //exlude the password hashed
                },
                {
                    model:User,
                    as:'UpdatedBy',
                    attributes: { exclude: ['password_hash'] } //exlude the password hashed
                }
            ]
       });
       if(product) {
        res.status(200).json(product);
       }else{
        res.status(404).json({message:'Product not found!'})
       }
    }catch(error) {
        console.error('Error fetching product by ID:',error);
        res.status(500).json({ message: 'Error fetching product', error: error.message });
    }
};

//update product by id
exports.updateProductById = async (req,res) => {
   try {
    const updatedProductData = {
        ...req.body, //take all the fields from the body
        updated_by_user_id: req.user.id
    };
    const updatedRows = await Product.update(updatedProductData, {
        where:{product_id:req.params.id}
    });

    if(updatedRows > 0) {
        const updatedProduct = await Product.findByPk(req.params.id, {
            include: [
                {model:Category},
                {
                    model:User,
                    as:'CreatedBy',
                    attributes: { exclude: ['password_hash'] } //exlude the password hashed
                },
                {
                    model:User,
                    as:'UpdatedBy',
                    attributes: { exclude: ['password_hash'] } //exlude the password hashed
                }
            ]
        });
        res.status(200).json(updatedProduct);
    }else{
        res.status(404).json({message: 'Product not found!'});
    }
   }catch(error) {
    console.error(error);
    res.status(400).json({message: 'Error updating the product',error:error.message})
   }
};

//create new product 
exports.createProduct = async (req,res) => {
    try {
        const newProductData = {
            ...req.body, //take all the fields from the body
            created_by_user_id:req.user.id,
            updated_by_user_id:req.user.id
        };

        const newProduct = await Product.create(newProductData);
        res.status(201).json(newProduct);
    }catch(error) {
        console.error('Error creating product:', error);
        res.status(400).json({message: 'Error creating product!',error:error.message});
    }
};

//delete a product by id
exports.deleteProductById = async (req,res) => {
    try {
        const deleted = Product.destroy({
            where:{product_id: req.params.id}
        });
        if(deleted){
            res.status(204).send(); //no content
        }else{
            res.status(404).json({message:'Product not found!'})
        }
    }catch(error) {
        console.error('Error deleting product:',error);
        res.status(500).json({message:'Error deleting product',error:error.message});
    }
};