const User = require('./User');
const Product = require('./Product');
const Category = require('./Category');
const {sequelize} = require('../config/sequelize')

//define associations
//a product belongs to one Category
Product.belongsTo(Category, {
    foreignKey: 'category_id',
    onDelete: 'SET NULL'
});

Category.hasMany(Product, {
    foreignKey: 'category_id'
});

Product.belongsTo(User, {
    as: 'CreatedBy', // Alias for this association
    foreignKey: 'created_by_user_id',
    onDelete: 'SET NULL' // What happens if the creator user is deleted
});

Product.belongsTo(User, {
    as: 'UpdatedBy', // Alias for this association
    foreignKey: 'updated_by_user_id',
    onDelete: 'SET NULL' // What happens if the updater user is deleted
});

User.hasMany(Product, {
    as:'CreatedProducts',
    foreignKey:'created_by_user_id'
});

User.hasMany(Product,{
    as:'UpdatedProducts',
    foreignKey:'updated_by_user_id'
});

// Category associations
Category.belongsTo(User, {
    as: 'CreatedBy',
    foreignKey: 'created_by_user_id',
    onDelete: 'SET NULL'
});

Category.belongsTo(User, {
    as: 'UpdatedBy',
    foreignKey: 'updated_by_user_id',
    onDelete: 'SET NULL'
});

User.hasMany(Category, {
    as: 'CreatedCategories',
    foreignKey: 'created_by_user_id'
});

User.hasMany(Category, {
    as: 'UpdatedCategories',
    foreignKey: 'updated_by_user_id'
});


module.exports = {
    sequelize,
    User,
    Category,
    Product
}