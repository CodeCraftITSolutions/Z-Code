const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
    problemId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    contestId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Contest'
    },
    code: {
        type: String,
        required: true
    },
    language: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: Boolean,
        required: true
    },
    grade: {
        type: Number
    },
    submittedAt: {
        type: Date,
        default: Date.now
    },
    testCases: [{
        input: String,
        expectedOutput: String,
        weight: Number
    }],
    results: [{
        input: String,
        expectedOutput: String,
        output: String,
        result: String,
        weight: Number,
        error: Boolean
    }]
}
,{timestamps: true});

module.exports = mongoose.model('Submission', submissionSchema);
