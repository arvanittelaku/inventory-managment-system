const {DataTypes} = require('sequelize');
const {sequelize} = require('../config/sequelize');


const Product = sequelize.define('Product' , {
    productId:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true,
        allowNull:false
    },
    name: {
        type:DataTypes.STRING(255),
        allowNull:false,
        unique:true
    },
    description:{
        type:DataTypes.TEXT
    },
    price: {
        type:DataTypes.DECIMAL(10,2),
        allowNull:false
    },
    quantity: {
        type:DataTypes.INTEGER,
        allowNull:false,
        defaultValue:0
    },
    category_id: { //this column is going to be our foreign key
        type:DataTypes.INTEGER,
        allowNull:true //can be null if a product doesnt have a category or  the category is deleted
    }
},{
    tableName:'products',
    timestamps:true
});

module.exports = Product;