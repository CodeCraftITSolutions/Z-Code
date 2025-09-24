const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
    usertype: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    read: {
        type: Boolean,
        default: false,
    },
    objectId: {
        type: mongoose.Schema.Types.ObjectId,
    },

    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }


    }
    , { timestamps: true });

module.exports = mongoose.model("Notification", notificationSchema);