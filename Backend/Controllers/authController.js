const userModel = require("../Models/UserModel") ;
const bcrypt = require("bcryptjs") ;
const jwt = require("jsonwebtoken") ;
const wrapAsync = require("../Utils/wrapAsync") ;
const express = require("express") ;

module.exports.signup = async(req,res)=> {
    const {email, password, username} = req.body ;

    if(!email || !password || !username) {
        return res.status(400).json({error : "Incomplete Information"}) ;

    }

    const user = await userModel.findOne({email}) ;

    if(user){
        return res.status(400).json({message : "User already exist"}) ;
    }

    const salt = await bcrypt.genSalt(10) ;
    const hashedPassword = await bcrypt.hash(password, salt) ;

    const newUser = await userModel.create({
        username,
        email,
        password : hashedPassword
    });
    
    res.status(201).json({message : "User created successfully please log in"}) ;
}

module.exports.login = async(req,res)=> {
    const {email, password} = req.body ;

    const user = await userModel.findOne({email}) ;
    if(!user) {
        return res.status(404).json({error : "User not Found"}) ;
    }

    const isMatch = await bcrypt.compare(password , user.password) ;

    if(!isMatch) {
       return res.status(400).json({error : "Invalid Credentials"}) ;
    }
    
    const token = jwt.sign(
        {id : user._id , username : user.username} ,
        process.env.JWT_SECRET ,
        {expiresIn : "7d"}
    );

    res.cookie("token", token , {
        httpOnly : true ,
        maxAge : 7 * 24 * 60 * 60 * 1000
    });

    res.status(200).json({
        message : "logged in successfully",
        user : {id : user._id, username : user.username, email : user.email} 
    }) ;
    
}

module.exports.logout = (req, res) => {
    try {
       
        res.clearCookie("token", {
            httpOnly: true,
          
        });
        res.status(200).json({ message: "Successfully logged out" });
        
    } catch (error) {
        console.error("Logout error:", error);
        res.status(500).json({ message: "Server error during logout" });
    }
}