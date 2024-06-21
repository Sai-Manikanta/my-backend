const SupportQuery = require('../models/supportQuery');
const transporterNodemailer = require('../utils/nodemailer-transporter');
const User = require('../models/user');

const createSupportQuery = async (req, res) => {
    try {
        const existingUser = await User.findOne({
            $and: [
                { uniqueId: req.body.uniqueId },
                { userName: req.body.userName }
            ]
        });

        if (!existingUser) {
            return res.status(400).json({
                error: 'No user account found with the given organization ID or username. Please check your details and try again',
            });
        }

        const newSupportQuery = new SupportQuery(req.body);

        await newSupportQuery.save();

        const mailOptions = {
            from: "saimani.bandaru123@gmail.com",
            to: "techsupport@mylapay.com, saimanikanta@happycure.in",
            subject: "Support Query",
            html: `
                <div>
                    <h1>Support Query</h1>
                    <hr />
                    <p>Organization Id: ${newSupportQuery.uniqueId}</p>
                    <p>User Name: ${newSupportQuery.userName}</p>
                    <p>Description: ${newSupportQuery.description}</p>
                </div>
            `,
        };

        try {
            let info = await transporterNodemailer.sendMail(mailOptions);

            res.status(200).json({
                message: 'Sent support query successfully.',
            });
        } catch (error) {
            res.status(500).json({
                error: error.toString()
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = {
    createSupportQuery
}