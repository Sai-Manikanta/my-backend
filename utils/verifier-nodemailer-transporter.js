const nodemailer = require("nodemailer");

const verifierTransporterNodemailer = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, 
    auth: {
        user: "verifiermylapay@gmail.com",
        pass: "ztyg uurw nnwg qjmm",
    },
});

module.exports = verifierTransporterNodemailer;