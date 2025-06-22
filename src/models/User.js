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
        unique:true,
         validate: {
            isEmail: {
                msg: 'Please provide a valid email address.'
            }
        }
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

User.beforeCreate(async (user) => {
    if(user.password_hash) { //ensure the password is hashed before user created
        const salt = await bcrypt.genSalt(10);
        user.password_hash = await bcrypt.hash(user.password_hash,salt);
    }
});

User.beforeUpdate(async (user) => {
    if (user.changed('password_hash')) {
        const salt = await bcrypt.genSalt(10);
        user.password_hash = await bcrypt.hash(user.password_hash, salt);
    }
});

//the method for password comparisons
User.prototype.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password_hash);
};

module.exports = User;