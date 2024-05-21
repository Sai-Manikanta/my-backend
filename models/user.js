const mongoose = require('mongoose');
const crypto = require('crypto');

const UserSchema = new mongoose.Schema({
    companyName: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    pincode: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/.+\@.+\..+/, 'Please fill a valid email address']
    },
    mobileNumber: {
        type: String,
        required: true,
        unique: true
    },
    productOfInterest: {
        type: String,
        required: true
    },
    verified: {
        type: Boolean,
        default: false
    },
    approved: {
        type: Boolean,
        default: false
    },
    secretkey: {
        type: String,
    },
    password: {
        type: String,
    },
    organizationId: {
        type: String,
    },
    userName: {
        type: String,
        unique: true
    }
}, {
    timestamps: true
});

function generatePassword(length = 12) {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*()_+~`|}{[]:;?><,./-='; 
    let password = '';
    const charsetLength = charset.length;

    const randomValues = crypto.randomBytes(length);

    for (let i = 0; i < length; i++) {
        const randomIndex = randomValues[i] % charsetLength;
        password += charset[randomIndex];
    }

    return password;
}

function generateSecretKey(length = 20) {
    return crypto.randomBytes(length).toString('hex');
}

UserSchema.pre('save', function(next) {
    if (this.isNew || this.isModified('secretkey')) {
        this.secretkey = generateSecretKey();
    }
    if (this.isNew || this.isModified('password')) {
        this.password = generatePassword();
    }
    if (this.isNew || this.isModified('organizationId')) {
        this.organizationId = generateSecretKey(10);
    }
    if (this.isNew || this.isModified('userName')) {
        const domain = this?.email?.split('@')[1]?.split('.')[0];
        const randomNumber = crypto.randomInt(1000, 9999);
        const generatedUserName = `${domain}${randomNumber}`;
        this.userName = generatedUserName;
    }

    next();
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
