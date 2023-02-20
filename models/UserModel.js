const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is required']
    },
    email: {
        type: String,
        required: [true, 'Email is required']
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    role: {
        type: String,
        default: 'user'
    },
    // userProfileName: {
    //     type: String,
    //     required: true
    // },
    userProfile:{
        data: Buffer,
        contentType: String
    },
    Date: {
        type: Date,
        default: Date.now
    }
})
module.exports = mongoose.model('User', UserSchema)