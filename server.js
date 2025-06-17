require('dotenv').config();
const express = require('express');
const app = express();

const {sequelize,connectDB: sequelizeConnectDB} = require('./src/config/sequelize');
require('./src/models/index')
sequelizeConnectDB()
.then(() => {
    console.log('Database connection established. Attempting to sync models...');
    return sequelize.sync({force:true});
})
.then(() => {
    console.log('Database synced successfully (tables created/updated based on models).');
     const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
})
.catch(err => {
    console.log('Error syncing database or starting server: ', err);
});

app.use(express.json());

app.get('/', (req,res) => {
    res.send('Inventory managment system API running')
});