const jwt = require('jsonwebtoken');
const User = require('../models/user');
const transporterNodemailer = require('../utils/nodemailer-transporter');
const verifierTransporterNodemailer = require('../utils/verifier-nodemailer-transporter');
const approvalTransporterNodemailer = require('../utils/approval-nodemailer-transporter');

const signup = async (req, res) => {
    try {
        const newUser = new User(req.body);

        await newUser.save();

        const mailOptions = {
            from: "saimani.bandaru123@gmail.com",
            to: "verifiermylapay@gmail.com",
            subject: "Account Verification",
            html: `
            <table border="1" cellpadding="10">
                <tr>
                    <td><b>Company Name</b></td>
                    <td>${req?.body?.companyName}</td>
                </tr>
                <tr>
                    <td><b>First Name</b></td>
                    <td>${req?.body?.firstName}</td>
                </tr>
                <tr>
                    <td><b>Last Name</b></td>
                    <td>${req?.body?.lastName}</td>
                </tr>
                <tr>
                    <td><b>Country</b></td>
                    <td>${req?.body?.country}</td>
                </tr>
                <tr>
                    <td><b>City</b></td>
                    <td>${req?.body?.city}</td>
                </tr>
                <tr>
                    <td><b>Pincode</b></td>
                    <td>${req?.body?.pincode}</td>
                </tr>
                <tr>
                    <td><b>Email</b></td>
                    <td>${req?.body?.email}</td>
                </tr>
                <tr>
                    <td><b>Mobile Number</b></td>
                    <td>${req?.body?.mobileNumber}</td>
                </tr>
                <tr>
                    <td><b>Product of Interest</b></td>
                    <td>${req?.body?.productOfInterest}</td>
                </tr>
            </table>
            <a href="https://mylapay-docs.vercel.app/verify?id=${newUser?._id}">Verify</a>
        `,
        };

        try {
            let info = await transporterNodemailer.sendMail(mailOptions);

            res.status(200).json({
                message: 'Registered user successfully, Send registered account for verification',
                // info: info.response
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

const verifyUser = async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req?.params?.id, { verified: true }, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (updatedUser?.verified) {
            const mailOptions = {
                from: "verifiermylapay@gmail.com",
                to: "approvermylapay@gmail.com",
                subject: "Account Approval",
                html: `
                <table border="1" cellpadding="10">
                    <tr>
                        <td><b>Company Name</b></td>
                        <td>${updatedUser?.companyName}</td>
                    </tr>
                    <tr>
                        <td><b>First Name</b></td>
                        <td>${updatedUser?.firstName}</td>
                    </tr>
                    <tr>
                        <td><b>Last Name</b></td>
                        <td>${updatedUser?.lastName}</td>
                    </tr>
                    <tr>
                        <td><b>Country</b></td>
                        <td>${updatedUser?.country}</td>
                    </tr>
                    <tr>
                        <td><b>City</b></td>
                        <td>${updatedUser?.city}</td>
                    </tr>
                    <tr>
                        <td><b>Pincode</b></td>
                        <td>${updatedUser?.pincode}</td>
                    </tr>
                    <tr>
                        <td><b>Email</b></td>
                        <td>${updatedUser?.email}</td>
                    </tr>
                    <tr>
                        <td><b>Mobile Number</b></td>
                        <td>${updatedUser?.mobileNumber}</td>
                    </tr>
                    <tr>
                        <td><b>Product of Interest</b></td>
                        <td>${updatedUser?.productOfInterest}</td>
                    </tr>
                </table>
                <a href="https://mylapay-docs.vercel.app/approve?id=${updatedUser?._id}">Approve</a>
            `,
            };

            try {
                let info = await verifierTransporterNodemailer.sendMail(mailOptions);

                return res.status(200).json({
                    message: 'Verified user successfully, Send for approval',
                    userName: updatedUser?.userName,
                    status: 'success',
                    // info: info.response
                });
            } catch (error) {
                return res.status(500).json({
                    error: error.toString(),
                    userName: updatedUser?.userName,
                    status: 'failed',
                });
            }
        }

        res.status(200).json({ message: 'Did not verified user' });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const approveUser = async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req?.params?.id, { approved: true }, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (updatedUser?.approved) {
            const mailOptions = {
                from: "approvermylapay@gmail.com",
                to: updatedUser?.email,
                subject: "Your Mylapay Account Approved",
                html: `
                    <div>
                       <h1>Congratulations, Your Mylapay account approved</h1>
                       <p>Use following credentials to login</p>

                       <hr />
                       <p>Organization Id: ${updatedUser?.organizationId}</p>
                       <p>UserName: ${updatedUser?.userName}</p>
                       <p>Password: ${updatedUser?.password}</p>
                       <p>Secret Key: ${updatedUser?.secretkey}</p>
                       <hr />

                       <a href="https://mylapay-docs.vercel.app/login">Login here</a>
                    </div>
                 `,
            };

            try {
                let info = await approvalTransporterNodemailer.sendMail(mailOptions);

                return res.status(200).json({
                    message: 'Approved user successfully',
                    userName: updatedUser?.userName,
                    status: 'success',
                    // info: info.response
                });
            } catch (error) {
                return res.status(500).json({
                    error: error.toString(),
                    userName: updatedUser?.userName,
                    status: 'failed',
                });
            }
        }

        res.status(200).json({ message: 'Did not approved user' });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const loginUser = async (req, res) => {
    const { organizationId, userName, password, secretKey } = req.body;

    try {
        const user = await User.findOne({ userName });
        if (!user) {
            return res.status(400).json({ error: 'The username you entered does not belong to any account.' });
        }

        if (user.organizationId !== organizationId) {
            return res.status(400).json({ error: 'The organization ID you entered is incorrect.' });
        }

        if (user.secretkey !== secretKey) {
            return res.status(400).json({ error: 'The secret key you entered is incorrect.' });
        }

        // const isMatch = await user.comparePassword(password);
        if (user.password !== password) {
            return res.status(400).json({ error: 'The password you entered is incorrect.' });
        }

        // const isMatch = await user.comparePassword(password);
        // if (!isMatch) {
        //     return res.status(400).json({ error: 'Invalid password' });
        // }

        // {"_id":{"$oid":"664b5a4ae9c2fe7509eefcce"},"companyName":"HappyCure","firstName":"Sai Manikanta","lastName":"Bandaru","country":"India","city":"Hyderabad","pincode":"501505","email":"saimanikanta@happycure.in","mobileNumber":"9505629940","productOfInterest":"Authentication","verified":true,"approved":true,"createdAt":{"$date":{"$numberLong":"1716214346837"}},"updatedAt":{"$date":{"$numberLong":"1716214461841"}},"secretkey":"11585f8324b862e1857536b6c549db620f82a1c9","password":"(.7~,ac4DeVI","organizationId":"697a1f879d6ffc705d2e","userName":"happycure4417","__v":{"$numberInt":"0"}}

        const token = jwt.sign({
            id: user._id,
            organizationId: user.organizationId,
            userName: user.userName
        }, "mylapay(.7~,ac4DeVI");
        //, { expiresIn: '1h' }

        const userData = {
            companyName: user?.companyName,
            firstName: user?.firstName,
            lastName: user?.lastName,
            country: user?.country,
            city: user?.city,
            pincode: user?.pincode,
            email: user?.email,
            mobileNumber: user?.mobileNumber,
            productOfInterest: user?.productOfInterest
        };

        res.json({ message: 'Successfully logged in user', token, user: userData });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
}

module.exports = {
    signup,
    verifyUser,
    approveUser,
    loginUser
}