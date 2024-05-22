const nodemailer = require("nodemailer");

const approvalTransporterNodemailer = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, 
    auth: {
        user: "approvermylapay@gmail.com",
        pass: "ocuz wpju jdiq ipxg", 
    },
});

module.exports = approvalTransporterNodemailer;