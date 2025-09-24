const mongoose = require('mongoose');

const contestSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    duration: {
        type: Number, // Duration in minutes, adjust data type as needed
        required: true
    },
    problems: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Problem'
        }
    ],
    createdBy :{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'       
            }
}, { timestamps: true });

module.exports = mongoose.model('Contest', contestSchema);
