const {DataTypes} = require('sequelize');
const {sequelize} = require('../config/sequelize');

const User = sequelize.define('User', {
    user_id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    username:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:true
    },
    email:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:true
    },
    password_hash: {
        type: DataTypes.STRING(255), 
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM('admin','manager', 'user'),
        defaultValue: 'user',
    },
    product_id:{ //this column will be our foreign key for product
        type:DataTypes.INTEGER,
        allowNull:true
    }
},
{
    tableName: 'users',
    timestamps: true, // Adds createdAt and updatedAt fields
});

module.exports = User;