const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
    name: String,
    email: String,
    message: String,
    createdAt: {
        type: Date,
        default: new Date()
    }
});

module.exports = mongoose.model('Message', messageSchema);
