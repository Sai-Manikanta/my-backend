const nodemailer = require("nodemailer");

const approvalTransporterNodemailer = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, 
    auth: {
        user: "approvermylapay@gmail.com",
        pass: "paxo bvcr thvl qjyg",
    },
});

module.exports = approvalTransporterNodemailer;