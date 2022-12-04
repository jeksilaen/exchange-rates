const express = require('express');
const mysql = require('mysql');
const router = express.Router();
const { JSDOM } = require( "jsdom" );
const { window } = new JSDOM( "" );
const $ = require( "jquery" )( window );


const db = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
})

router.get('/latest', (req, res) => {
    const api_key = req.query.api_key
    
    db.query('SELECT * FROM users WHERE api_key = ?', [api_key], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                status : res.statusCode,
                msg : "An error occurred, please try again."
            })
        }
        else{
            if (result.length > 0) {
                $.get('https://openexchangerates.org/api/latest.json', {app_id: process.env.APP_ID}, function(data) {
                    delete data.disclaimer;
                    delete data.license;
                    delete data.timestamp;
                    return res.status(200).json(data)
                });
                
            }else{
                return res.status(401).json({
                    status : res.statusCode,
                    msg : "Invalid API Key, please generate a new key by creating a new account or login to existing : http://localhost:8080/login"
                })
            }
        }
    })


    
})



module.exports = router;