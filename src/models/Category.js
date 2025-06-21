// src/models/category.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/sequelize'); 

const Category = sequelize.define('Category', {
    category_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    description: {
        type: DataTypes.TEXT,
    },
    created_by_user_id: { 
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    updated_by_user_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
    }
}, {
    tableName: 'categories',
    timestamps: true 
});

module.exports = Category;