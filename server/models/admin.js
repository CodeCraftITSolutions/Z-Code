const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({

    username: {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    
},  
);

module.exports = mongoose.model('Admin', adminSchema);