const mongoose = require('mongoose');

const productManagementSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    merchantPlugins: {
        mylapay3DSSv23: { type: Boolean, default: false }
    },
    authorization: {
        payments: { type: Boolean, default: false },
        reversal: { type: Boolean, default: false },
        capture: { type: Boolean, default: false },
        refund: { type: Boolean, default: false },
        void: { type: Boolean, default: false },
        status: { type: Boolean, default: false }
    },
    networkTokens: {
        networkTokens: { type: Boolean, default: false }
    },
    risk: {
        riskCheck: { type: Boolean, default: false },
        reportFraud: { type: Boolean, default: false }
    },
    dispute: {
        disputeCheck: { type: Boolean, default: false },
        disputeAction: { type: Boolean, default: false }
    },
    valueAddedServices: {
        fxChecker: { type: Boolean, default: false },
        binChecker: { type: Boolean, default: false },
        mccChecker: { type: Boolean, default: false },
        costChecker: { type: Boolean, default: false }
    },
    webhooks: {
        disputes: { type: Boolean, default: false },
        riskyTransactions: { type: Boolean, default: false }
    },
    keyManagementFile: {
        type: Object,
        default: {}
    }
});

const ProductManagement = mongoose.model('ProductManagement', productManagementSchema);
module.exports = ProductManagement