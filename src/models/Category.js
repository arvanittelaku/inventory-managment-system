const {DataTypes} = require('sequelize');
const {sequelize} = require('../config/sequelize');

const Category = sequelize.define('Category', {
    category_id: {
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    name: {
        type:DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    description: {
        type:DataTypes.TEXT,
    },
},{
    tableName: 'categories',
    timestamps: false
});

module.exports = Category;
