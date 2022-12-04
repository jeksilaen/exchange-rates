const mysql = require('mysql');
const bcrypt = require('bcryptjs') ;

const db = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
})


const register = (req, res) => {
    const {email, password, secretCode, userCode} = req.body;

    db.query('SELECT email FROM users WHERE email = ?', [email], async(err, results) => {
        if (err) {
            console.log(err);
            return res.render('register', {message:"There was an error"})
        }

        if (results.length > 0) {
            return res.render('register', {message:"Email has been taken"})
         
        }else if(secretCode !== userCode){
            return res.render('register', {message:"Verification code is wrong"})
        }
        
        let hashedPassword = await bcrypt.hash(password, 8);

        const api_key = Math.random().toString(36).slice(2);

        db.query('INSERT INTO users SET ?', {email: email, password:hashedPassword, api_key:api_key}, (err, results) => {
            if (err) {
                console.log(err);
            }
            else{
                return res.render('home', {api_key})
            }
        })

    })
}

const login = (req, res) => {
    const {email, password} = req.body;

    db.query('SELECT * FROM users WHERE email = ?', [email], (err, result) => {
        if (err) {
            console.log(err);
            return res.render('login')
        }
        else{
            if (result.length > 0) {
                let actualPassword = result[0].password
                let api_key = result[0].api_key

                bcrypt.compare(password, actualPassword, function(err, result) {
                    if (err) {
                    console.log(err);
                    return res.render('login')
                    }
                    else {
                        if (result) {
                            return res.render('home', {api_key : api_key})
                        }else{
                            return res.render('login')
                        }
                    }
                });
            }else{
                return res.render('login')
            }
        }

        

    })
}




module.exports = {register, login}