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
                    <td><b>Entity Name</b></td>
                    <td>${req?.body?.entityName}</td>
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
                    <td><b>Secret key</b></td>
                    <td>${newUser?.secretkey}</td>
                </tr>
                <tr>
                    <td><b>Organization Id</b></td>
                    <td>${newUser?.uniqueId}</td>
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
                message: 'Registered user successfully, Send registered account for verification'
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
                    <td><b>Entity Name</b></td>
                    <td>${updatedUser?.entityName}</td>
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
                    <td><b>Secret key</b></td>
                    <td>${updatedUser?.secretkey}</td>
                </tr>
                <tr>
                    <td><b>Organization Id</b></td>
                    <td>${updatedUser?.uniqueId}</td>
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
                    status: 'success'
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
                       <p>To generate a new password, please click the link <a href="${url}"><b>Generate Password</b></a></p>
                    </div>
                 `,
            };

            try {
                let info = await approvalTransporterNodemailer.sendMail(mailOptions);

                return res.status(200).json({
                    message: 'Approved user successfully',
                    userName: updatedUser?.userName,
                    status: 'success'
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
    const { uniqueId, userName, password, secretKey } = req.body;

    const Code2FA = req?.body?.['2FACode'];

    try {
        const user = await User.findOne({ email: userName });
        if (!user) {
            return res.status(400).json({ error: 'The username you entered does not belong to any account.' });
        }

        // if (user.uniqueId !== uniqueId) {
        //     return res.status(400).json({ error: 'The organization ID you entered is incorrect.' });
        // }

        // if (user.secretkey !== secretKey) {
        //     return res.status(400).json({ error: 'The secret key you entered is incorrect.' });
        // }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'The password you entered is incorrect.' });
        }

        const token = jwt.sign({ _id: user._id }, "mylapay(.7~,ac4DeVI"); //, { expiresIn: '1h' }

        const userData = {
            _id: user?._id,
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
            uniqueId: user?.uniqueId,
            vcMerchantId: user?.vcMerchantId,
            userName: user?.userName
        };

        res.json({ message: 'Successfully logged in user', token, user: userData });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
}

const verifySandboxAccess = async (req, res) => {
    console.log("from controller", req.user);

    if (req?.user?.uniqueId === req?.body?.uniqueId) {
        res.status(200).json({
            name: 'Verify Sandbox Accesss'
        })
    } else {
        res.status(403).json({
            name: 'Organization Id verification failed'
        })
    }
}

const getMyDetailsOLD = async (req, res) => {
    const user = req?.user;
    if (req?.user) {
        res.status(200).json({
            message: 'fetched Users Successfully',
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
                uniqueId: user.uniqueId,
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

const getMyDetails = async (req, res) => {
    const user = req?.user;
    if (req?.user) {
        res.status(200).json({
            message: 'fetched Users Successfully',
            user: {
                _id: user._id,
                entityName: user.entityName,
                firstName: user.firstName,
                lastName: user.lastName,
                country: user.country,
                city: user.city,
                pincode: user.pincode,
                email: user.email,
                mobileNumber: user.mobileNumber,
                productOfInterest: user.productOfInterest,
                typeOfEntity: user.typeOfEntity,
                dateOfIncorporation: user.dateOfIncorporation,
                // secretkey: user.secretkey,
                // uniqueId: user.uniqueId,
                // vcMerchantId: user.vcMerchantId,
                userName: user.userName,
            }
        })
    } else {
        res.status(403).json({
            name: 'Organization Id verification failed'
        })
    }
}

const generatePassword = async (req, res) => {
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

    res.status(200).json({
        message: 'Password has been reset.'
    });
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

    res.status(200).json({
        message: 'Password has been reset.'
    });
}

const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Generate a reset token
        const token = jwt.sign({ userId: user._id }, "mylapay(.7~,ac4DeVI", { expiresIn: '1h' });

        // Construct the reset URL
        const resetUrl = `https://mylapay-docs.vercel.app/reset-password/${token}`;

        // Mail options
        const mailOptions = {
            from: 'saimani.bandaru123@gmail.com',
            to: user.email,
            subject: 'Password Reset Request',
            html: `
                <div>
                    <h1>Password Reset</h1>
                    <p>We received a request to reset your password. Click the link below to reset your password:</p>
                    <a href="${resetUrl}">Reset Password</a>
                    <p><strong>Note:</strong> This link is valid for 1 hour only.</p>
                </div>
            `
        };

        // Send the email
        await transporterNodemailer.sendMail(mailOptions);

        res.status(200).json({ message: 'Password reset link sent' });
    } catch (error) {
        console.error('Error sending password reset email:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

// const updateProfileData = async (req, res) => {
//     try {
//         const id = req?.user?._id;
//         const updateData = req.body;

//         const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });

//         if (!updatedUser) {
//             return res.status(404).json({ message: 'User not found' });
//         }

//         res.status(200).json(updatedUser);
//     } catch (error) {
//         res.status(400).json({ message: error.message });
//     }
// }

const updateProfileData = async (req, res) => {
    const { userId, changes } = req.body;

    console.log(req.body);
    console.log(req.user)

    try {
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).send('User not found');

        user.pendingChanges = changes;
        await user.save();

        // Send verification email
        // sendVerificationEmail(user);

        const mailOptions = {
            from: "saimani.bandaru123@gmail.com",
            to: "verifiermylapay@gmail.com",
            subject: "Update Profile Verification",
            html: `<p>Please verify the changes for user ${user.firstName} ${user.lastName} by clicking the following link: <a href="https://mylapay-docs.vercel.app/approve-profile-changes/${user._id}">Verify</a></p>`,
        };

        try {
            let info = await transporterNodemailer.sendMail(mailOptions);

            res.status(200).json({
                message: 'Update Profile information saved and triggered mail to verifier successfully'
            });
        } catch (error) {
            res.status(500).json({
                error: error.toString()
            });
        }

        // res.status(200).send('Profile update requested. A verification email has been sent.');
    } catch (error) {
        res.status(500).send(error.message);
    }
}

const getProfileChanges = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) return res.status(404).send('User not found');

        res.status(200).send({ pendingChanges: user.pendingChanges, userPreviousData: user });
    } catch (error) {
        res.status(500).send(error.message);
    }
}

const approveChanges = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) return res.status(404).send('User not found');

        console.log(user);

        const pendingChangesObject = Object.fromEntries(user.pendingChanges);

        const firstName = pendingChangesObject.firstName;
        const lastName = pendingChangesObject.lastName;
        const mobileNumber = pendingChangesObject.mobileNumber;

        if(firstName){
            user.firstName = firstName;
        }

        if(lastName){
            user.lastName = lastName;
        }

        if(mobileNumber){
            user.mobileNumber = mobileNumber;
        }
        
        user.pendingChanges = {}

        await user.save();

        const mailOptions = {
            from: "saimani.bandaru123@gmail.com",
            to: user.email,
            subject: "Profile Update",
            html: `<p>Your profile update has been approved and updated. Thank you</p>`,
        };

        try {
            let info = await transporterNodemailer.sendMail(mailOptions);

            res.status(200).json({
                message: 'Changes approved and profile updated'
            });
        } catch (error) {
            res.status(500).json({
                error: error.toString()
            });
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
}

module.exports = {
    signup,
    verifyUser,
    approveUser,
    loginUser,
    getMyDetails,
    verifySandboxAccess,
    resetPassword,
    generatePassword,
    forgotPassword,
    updateProfileData,
    getProfileChanges,
    approveChanges
}