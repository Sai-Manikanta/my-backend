const nodemailer = require("nodemailer");

const transporterNodemailer = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, 
    auth: {
        user: "saimani.bandaru123@gmail.com",
        pass: "jvsc yjbj zttf vctm",
    },
});

module.exports = transporterNodemailer;