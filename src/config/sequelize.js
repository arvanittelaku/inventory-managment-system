const {Sequelize} = require('sequelize');
require('dotenv').config();
console.log('--- Sequelize config file loaded ---'); // <-- ADD THIS LINE

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect:'postgres',
    logging:console.log
});

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connection has been established successfully.');
    }catch(error) {
        console.error('Unable to connect to the database:', error);
        process.exit(1); // Exit the process with failure
    }
};

const syncModels = async () => {
    try {
        require('../models');
        await sequelize.sync({alter:true});
        console.log('All models were synchronized successfully.');
    }catch(error) {
        console.error('Unable to sync models:', error);
    }
};

module.exports = {sequelize, connectDB,syncModels};