const mongoose = require('mongoose');


mongoose.connect("url")


const userSchema = new mongoose.Schema({

    firstName : {
        type : String,
        required : true
    },

    lastName: {
        type: String,
        required : true
    },

    username : {
        type : String,
        required : true,
        unique : true
    },

    password : {
        type : String,
        required : true
    }
})

const accountSchema = new mongoose.Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        require : true,
        ref : 'User'
    },

    balance : {
        type : Number,
        required : true
    }
})


const User = mongoose.model("User", userSchema)
const Account = mongoose.model("Account",accountSchema)

module.exports = {
    User,
    Account
}