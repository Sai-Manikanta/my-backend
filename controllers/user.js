const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const transporterNodemailer = require('../utils/nodemailer-transporter');
const verifierTransporterNodemailer = require('../utils/verifier-nodemailer-transporter');
const approvalTransporterNodemailer = require('../utils/approval-nodemailer-transporter');

const signup = async (req, res) => {
    try {
        const existingUser = await User.findOne({
            $or: [
                { email: req.body.email },
                { mobileNumber: req.body.mobileNumber }
            ]
        });

        if (existingUser) {
            return res.status(400).json({
                error: 'User already exists with the provided email or mobile number. Please try logging in instead.',
            });
        }

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
                <tr>
                    <td><b>Secret key</b></td>
                    <td>${newUser?.secretkey}</td>
                </tr>
                <tr>
                    <td><b>Organization Id</b></td>
                    <td>${newUser?.organizationId}</td>
                </tr>
                <tr>
                    <td><b>User Name</b></td>
                    <td>${newUser?.userName}</td>
                </tr>
                <tr>
                    <td><b>VC Merchant ID</b></td>
                    <td>${newUser?.vcMerchantId}</td>
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
                <tr>
                    <td><b>Secret key</b></td>
                    <td>${updatedUser?.secretkey}</td>
                </tr>
                <tr>
                    <td><b>Organization Id</b></td>
                    <td>${updatedUser?.organizationId}</td>
                </tr>
                <tr>
                    <td><b>User Name</b></td>
                    <td>${updatedUser?.userName}</td>
                </tr>
                <tr>
                    <td><b>VC Merchant ID</b></td>
                    <td>${updatedUser?.vcMerchantId}</td>
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
            const token = jwt.sign({ userId: updatedUser._id }, "mylapay(.7~,ac4DeVI"); // { expiresIn: '1h' }

            const url = `https://mylapay-docs.vercel.app/generate-password/${token}`;

            const mailOptions = {
                from: "approvermylapay@gmail.com",
                to: updatedUser?.email,
                subject: "Your Mylapay Account Approved",
                html: `
                    <div>
                       <h1>Congratulations, your Mylapay Account is approved!</h1>
                       <hr />
                       <p>Please find your user details below.</p>
                       <p>Organization Id: ${updatedUser?.organizationId}</p>
                       <p>UserName: ${updatedUser?.userName}</p>
                       <p>Secret key: ${updatedUser?.secretkey}</p>
                       <hr />
                       <p>To generate a new password, please click the link <a href="${url}"><b>Generate Password</b></a></p>
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

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'The password you entered is incorrect.' });
        }

        // {"_id":{"$oid":"664b5a4ae9c2fe7509eefcce"},"companyName":"HappyCure","firstName":"Sai Manikanta","lastName":"Bandaru","country":"India","city":"Hyderabad","pincode":"501505","email":"saimanikanta@happycure.in","mobileNumber":"9505629940","productOfInterest":"Authentication","verified":true,"approved":true,"createdAt":{"$date":{"$numberLong":"1716214346837"}},"updatedAt":{"$date":{"$numberLong":"1716214461841"}},"secretkey":"11585f8324b862e1857536b6c549db620f82a1c9","password":"(.7~,ac4DeVI","organizationId":"697a1f879d6ffc705d2e","userName":"happycure4417","__v":{"$numberInt":"0"}}
        // comment for deployment


        const token = jwt.sign({ _id: user._id }, "mylapay(.7~,ac4DeVI"); //, { expiresIn: '1h' }

        const userData = {
            companyName: user?.companyName,
            firstName: user?.firstName,
            lastName: user?.lastName,
            country: user?.country,
            city: user?.city,
            pincode: user?.pincode,
            email: user?.email,
            mobileNumber: user?.mobileNumber,
            productOfInterest: user?.productOfInterest,
            secretkey: user?.secretkey,
            organizationId: user?.organizationId,
            vcMerchantId: user?.vcMerchantId
        };

        res.json({ message: 'Successfully logged in user', token, user: userData });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
}

const verifySandboxAccess = async (req, res) => {
    console.log("from controller", req.user);

    if (req?.user?.organizationId === req?.body?.organizationId) {
        res.status(200).json({
            name: 'Verify Sandbox Accesss'
        })
    } else {
        res.status(403).json({
            name: 'Organization Id verification failed'
        })
    }
}

const getMyDetails = async (req, res) => {
    const user = req?.user;
    if (req?.user) {
        res.status(200).json({
            message: 'fecthed Users Successfully',
            user: {
                _id: user._id,
                companyName: user.companyName,
                firstName: user.firstName,
                lastName: user.lastName,
                country: user.country,
                city: user.city,
                pincode: user.pincode,
                email: user.email,
                mobileNumber: user.mobileNumber,
                productOfInterest: user.productOfInterest,
                secretkey: user.secretkey,
                organizationId: user.organizationId,
                vcMerchantId: user.vcMerchantId,
                userName: user.userName,
            }
        })
    } else {
        res.status(403).json({
            name: 'Organization Id verification failed'
        })
    }
}

const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    let payload;
    try {
        payload = jwt.verify(token, "mylapay(.7~,ac4DeVI");
    } catch (e) {
        return res.status(400).send('Invalid or expired token.');
    }

    const user = await User.findById(payload.userId);

    if (!user) {
        return res.status(400).send('User does not exist.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    const updatedUser = await user.save();

    console.log({
        payload, hashedPassword, user, updatedUser
    })

    res.status(200).json({
        message: 'Password has been reset.'
    });
}

module.exports = {
    signup,
    verifyUser,
    approveUser,
    loginUser,
    getMyDetails,
    verifySandboxAccess,
    resetPassword
}