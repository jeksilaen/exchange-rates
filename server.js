require('dotenv').config()

const express = require('express');
const reload = require('reload');
const mysql = require('mysql');

const app = express();


//Middleware for json and urlencoded requests
app.use(express.urlencoded({ extended: true })); 
app.use(express.json());
app.set('view engine', 'ejs');


//Routes for Webpages, API, and Auth
app.use('/', require('./routes/pages'));
app.use('/api', require('./routes/api'));
app.use('/auth', require('./routes/auth'));


//MySQL connection
const db = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
})

db.connect( (err) => {
    if (err) {
        console.log(err);
    }else{
        console.log("Connected to MySQL!");
    }
})



const PORT = process.env.PORT || 8080;
app.listen(PORT, ()=>{
    console.log(`Server is running on  http://localhost:${PORT}`);
})

//Reload package for hot reload (dev only)
reload(app);