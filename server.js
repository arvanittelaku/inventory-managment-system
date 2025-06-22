require('dotenv').config(); //loads the enviroment variables

const express = require('express');
const sequelizeConfig = require('./src/config/sequelize'); //db config
const productRoutes = require('./src/routes/productRoutes');//product routes
const userRoutes = require('./src/routes/userRoutes');//user routes
const categoryRoutes = require('./src/routes/categoryRoutes');//user routes


const AppError = require('./src/utils/appError');
const errorHandler = require('./src/middlewares/errorHandler');

const app = express();

const PORT = process.env.PORT || 5000;

// Middleware to parse JSON request bodies
app.use(express.json());

// Connect to DB
sequelizeConfig.connectDB();

// Mount routes
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/auth', userRoutes);

// Basic root route
app.get('/', (req, res) => {
    res.send('API is running...');
});

// ALTERNATIVE CATCH-ALL FOR UNHANDLED ROUTES (404)
// This middleware will run if no previous route matched the request.
app.use((req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// GLOBAL ERROR HANDLING MIDDLEWARE
app.use(errorHandler);

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
});