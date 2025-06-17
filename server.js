require('dotenv').config();
const express = require('express');
const app = express();

const {connectDB: sequelizeConnectDB} = require('./src/config/sequelize');

sequelizeConnectDB();