const {Sequelize} = require('sequelize');
require('dotenv').config();

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
        process.exit(1);
    }
};

module.exports = {sequelize, connectDB};