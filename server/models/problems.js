const mongoose = require('mongoose')
const problemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    difficulty: {
        type: Number,
        required: true
    },
    category : {
        type : String,
        required: true
    },
    customCategory : {
        type : String,
    },
    description: {
        type: String,
    },
    initialCode : {
        type : [
            {
                code : {
                    type : String
                },
                language : {
                    type: String
                }
            }
        ]
    },

    isPractice : {
        type : Boolean
    },
    createdBy:{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },

    addedBy:{
        type : String
    },
    //testcases has input and expected output
    testCases: {
        type: [
            {
                input : {
                    type : String
                },
                expectedOutput:{
                    type : String
                },
                isSample:{
                    type:Boolean
                },
                weight : {
                    type : Number
                }
            }
        ],
        default: []
    },
    //grade
    grade : {
        type : Number
    },

    examples:{
        type:[
            {
                input:{
                    type : String,
                },
                output:{
                    type:String,
                }
                ,explanation :{
                    type:String
                }
            }
        ]
    }

    

    },{timestamps: true})

module.exports = mongoose.model('Problem',problemSchema)