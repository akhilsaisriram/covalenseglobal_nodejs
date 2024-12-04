const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    dob: {
        type: Date,
        required: true,
    },
    studentClass: {
        type: String,
        required: true,
    },
    feePaid: {
        type: Boolean,
        default: false,
    },
});

module.exports = mongoose.model('Student', studentSchema);
