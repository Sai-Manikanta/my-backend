const mongoose = require('mongoose');

const supportQuerySchema = new mongoose.Schema({
    organizationId: {
        type: String,
    },
    userName: {
        type: String,
    },
    description: {
        type: String,
    }
}, {
    timestamps: true
});

const SupportQuery = mongoose.model('SupportQuery', supportQuerySchema);

module.exports = SupportQuery;
