const mongoose = require('mongoose');
const bcrypt = require('bcrypt')

mongoose.connect("mongodb+srv://devendersingh2k:CVfWa8DWQbmQZNCT@cluster0.9gy2k2z.mongodb.net/MoneyTransfer")


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

// Method to generate a hash from plain text
userSchema.methods.createHash = async function(plaintext){
    const saltRounds = 10;

    const salt = await bcrypt.genSalt(saltRounds);
    return await bcrypt.hash(plaintext,salt);
}

// Validating the candidate password with stored hash and hash function
userSchema.methods.validatePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
  };

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