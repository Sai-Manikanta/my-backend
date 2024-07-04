const mongoose = require('mongoose');

const ProductManagementSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User' // Assuming you have a User model
    },
    products: {
        merchantPlugins: {
            type: Boolean,
            default: false
        },
        ['3DSSecure']: {
            type: Boolean,
            default: false
        },
        authorization: {
            type: Boolean,
            default: false
        },
        networkTokens: {
            type: Boolean,
            default: false
        },
        risk: {
            type: Boolean,
            default: false
        },
        dispute: {
            type: Boolean,
            default: false
        },
        valueAddedServices: {
            type: Boolean,
            default: false
        },
        webhooks: {
            type: Boolean,
            default: false
        }
    }
}, {
    timestamps: true
});

const ProductManagement = mongoose.model('ProductManagement', ProductManagementSchema);

module.exports = ProductManagement;
