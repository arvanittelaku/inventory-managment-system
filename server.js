require('dotenv').config(); //loads the enviroment variables

const express = require('express');
const sequelizeConfig = require('./src/config/sequelize'); //db config
const productRoutes = require('./src/routes/productRoutes');//product routes
const userRoutes = require('./src/routes/userRoutes');//user routes
const categoryRoutes = require('./src/routes/categoryRoutes');//user routes
const app = express();

const PORT = process.env.PORT || 5000;

//middleware to parse json request bodies 
app.use(express.json());

//connect to db and sync models
sequelizeConfig.connectDB();
sequelizeConfig.syncModels();

//mount routes
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/auth', userRoutes);

//global error handling
app.use((err,req,res,next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!'); //generic error response
});
app.get('/', (req, res) => {
    res.send('API is running...');
});
app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
});

