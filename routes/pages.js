const express = require('express');
const mysql = require('mysql');
const router = express.Router();

const {sendMail} = require('../utility/sendmail')

const db = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
})

//Home Page -- Login
router.route("/")
    .get((req, res) => {
        res.redirect('/login');
    })

//Login Page
router.route("/login")
    .get((req, res) => {
        res.render('login');
    })

    .post((req, res) => {
        const {email, password} = req.body;

        console.log(email, password);
    })

//Register Page
router.route("/register")
    .get((req, res) => {
        res.render('register', {message : ''});
    })

    .post((req, res) => {
        const {email, password} = req.body;

        db.query('SELECT email FROM users WHERE email = ?', [email], (err, results) => {
            if (err) {
                console.log(err);
                return res.render('register', {message:"There was an error"})
            }
    
            if (results.length > 0) {
                return res.render('register', {message:"Email has been taken"})
             
            }
            //sendMail will send a verification code to the users email AND return a secret code
            const secretCode = sendMail(email);
            res.render('validate', {secretCode, email, password})
        })

    })




module.exports = router;
