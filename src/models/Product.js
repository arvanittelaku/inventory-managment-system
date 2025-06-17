const {DataTypes} = require('sequelize');
const {sequelize} = require('../config/sequelize');


const Product = sequelize.define('Product', {
    product_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    category_id: {
        type: DataTypes.INTEGER,
        allowNull: true // Can be null if category is deleted
    },
    // NEW COLUMNS FOR USER ASSOCIATION
    created_by_user_id: {
        type: DataTypes.INTEGER,
        allowNull: true, 
    },
    updated_by_user_id: {
        type: DataTypes.INTEGER,
        allowNull: true, // Can be null for initial products or if user is deleted
    }
},{
    tableName:'products',
    timestamps:true
});

module.exports = Product;