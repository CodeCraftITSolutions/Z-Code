const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    age: {
        type: Number,
    },
    password: {
        type: String,
        required: true
    },
    department: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    regNo: {
        type: String,
        unique: true
    },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },


},
{timestamps: true}
);

module.exports = mongoose.model('Student', studentSchema);