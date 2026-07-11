const mongoose = require("mongoose") ;

const {Schema} = mongoose ;

const userSchema = new Schema({

    username : {
        type : String,
        unique :[true, "this username already exists try different"],
        required : [true, "please enter your username"],
        minLength : [4, "UserName must contain at least 4 characters"],
        maxLength : [15, "username must not exceed 15 charcters"],
        trim : true 
    },

    email : {
        type : String,
        unique :[true, "this gmail already exists"],
        required : [true, "please enter your email"] ,
        trim : true 

    },

    password : {
        type : String,
        required : [true, "please enter the password"]
    }
});

module.exports = mongoose.model("User", userSchema) ;