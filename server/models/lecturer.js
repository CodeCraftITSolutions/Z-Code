const mongoose = require('mongoose');

const lecturerSchema = new mongoose.Schema({

    username: {
        type: String,
        required: true
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
    isApproved: {
        type: Boolean,
        default: false
    },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    
},  {timestamps: true}
);

module.exports = mongoose.model('Lecturer', lecturerSchema);