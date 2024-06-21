const mongoose = require('mongoose');
const crypto = require('crypto');

const UserSchema = new mongoose.Schema({
    entityName: {
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
    // city: {
    //     type: String,
    //     required: true
    // },
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
    // productOfInterest: {
    //     type: [String],
    //     required: true
    // },
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
    uniqueId: {
        type: String,
    },
    userName: {
        type: String,
        unique: true
    },
    vcMerchantId: {
        type: String
    },
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

function generateSecretKey(length) {
    const alphabets = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    const digits = '0123456789';
    const allCharacters = alphabets + digits;
    const allCharactersLength = allCharacters.length;

    let secretKey = '';
    secretKey += alphabets.charAt(crypto.randomInt(alphabets.length));
    secretKey += digits.charAt(crypto.randomInt(digits.length));

    for (let i = 2; i < length; i++) {
        const randomIndex = crypto.randomInt(allCharactersLength);
        secretKey += allCharacters[randomIndex];
    }

    secretKey = secretKey.split('').sort(() => 0.5 - Math.random()).join('');

    return secretKey;
}

UserSchema.pre('save', async function (next) {
    if (this.isNew || this.isModified('secretkey')) {
        this.secretkey = generateSecretKey(20);
    }
    if (this.isNew) {
        this.password = generatePassword();
    }
    if (this.isNew || this.isModified('uniqueId')) {

        const domain = this?.email?.split('@')[1]?.split('.')[0];

        const user = await mongoose.model('User').findOne({ uniqueId: new RegExp(`${domain}-`) });

        if (user) {
            this.uniqueId = user.uniqueId;
            this.vcMerchantId = user.uniqueId;
        } else {
            const legalName = domain;
            const lengthOfLegalName = legalName?.length;
            let uniqueString = "";

            if (lengthOfLegalName >= 7) {
                const truncatedName = legalName?.slice(0, 7);
                const randomNums = generateSecretKey(8);
                uniqueString = `${truncatedName}_${randomNums}`; 
            } else {
                const randomNums = generateSecretKey(15 - lengthOfLegalName);
                uniqueString = `${legalName}_${randomNums}`;
            }

            this.uniqueId = uniqueString;
            this.vcMerchantId = uniqueString;

            // const random = generateSecretKey(20);
            // console.log(random)
            // const length = domain.length + 1;
            // const trimmedRandom = random.slice(length);
            // this.uniqueId = `${domain}-${trimmedRandom}`;
            // this.vcMerchantId = `${domain}-${trimmedRandom}`;
        }

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
