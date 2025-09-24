const mongoose = require('mongoose')

const draftCodesSchema = new mongoose.Schema({
    codes: {
        type: [
            {
                code: {
                    type: String
                },
                language: {
                    type: String
                }
            }
        ]

    },
    userId: {
        type: String
    },
    problemId:{
         type: String
    },
    contestId:{
        type: String
   },



});

module.exports = mongoose.model('DraftCodes', draftCodesSchema);
