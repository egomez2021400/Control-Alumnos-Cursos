'use strict'//metodo estricto

const express = require("express");//constante express
const app = express();
const {connection} = require("./src/database/connection");
require('dotenv').config();
const port = process.env.PORT;
const curses = require('./src/routes/curses.routes');
const user = require('./src/routes/user.routes');

connection();

app.use(express.urlencoded({extended: false}));

app.use(express.json());

app.use('/api', curses, user);

app.listen(port, function(){
    console.log(`El servido esta conectado al puerto ${port}`);
});