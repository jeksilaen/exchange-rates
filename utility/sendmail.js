const nodemailer = require('nodemailer');

//Sender details for sending verification code
const transporter = nodemailer.createTransport({
    service: "hotmail",
    auth: {
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_PASS
    }
})

const sendMail = (userEmail) => {
    const secretCode = Math.floor(1000 + Math.random() * 9000);

    const options = {
        from: "ippo7707@outlook.com",
        to: String(userEmail),
        subject: "Secret Code!",
        text: String(secretCode)
    };

    transporter.sendMail(options, (err, info) => {
        if (err) {
            console.log(err);
            return;
        }
        console.log("Sent: " + info.response);
    })
    return String(secretCode);
}

module.exports = {sendMail};


