require('dotenv').config(); //loads the enviroment variables

const express = require('express');
const sequelizeConfig = require('./src/config/sequelize'); //db config
const productRoutes = require('./src/routes/productRoutes');//product routes
const userRoutes = require('./src/routes/userRoutes');//user routes
const categoryRoutes = require('./src/routes/categoryRoutes');//user routes
const { AppError, NotFoundError, BadRequestError, UnauthorizedError, ForbiddenError } = require('./src/utils/appError');
const app = express();

const PORT = process.env.PORT || 5000;

//middleware to parse json request bodies 
app.use(express.json());

//connect to db
sequelizeConfig.connectDB();

//mount routes
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/auth', userRoutes);

//global error handling
app.use((req, res, next) => {
    next(new NotFoundError(`Can't find ${req.originalUrl} on this server!`));
});

//global error handler middleware
app.use((err,req,res,next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    //logging the error if debugging needed
    console.error('Global error handler',err);

    if (process.env.NODE_ENV === 'development') {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
            error: err,
            stack: err.stack // Full stack trace for debugging
        });
    } else { // Production environment
        if (err.isOperational) {
            res.status(err.statusCode).json({
                status: err.status,
                message: err.message
            });
        } else {
            
            res.status(500).json({
                status: 'error',
                message: 'Something went very wrong!' 
            });
        }
    }
    
})




app.get('/', (req, res) => {
    res.send('API is running...');
});
app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
});