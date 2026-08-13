const mongoose = require("mongoose") ;
const {Schema} = mongoose ;

const PostSchema = new Schema({
    content : {
        type : String,
    },

    imageUrl : {
        type : String,
    },

    author : {
        type : Schema.Types.ObjectId, ref : "User",
        required : true,
        index : true ,
    },

    caption : {
        type : String,
        required : true ,
    },

    upvotedBy :[{
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    }],

    downvotedBy : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "User" 
    }],

    commentCount : {
        type : Number,
        default : 0 
    }
    

}, {timestamps : true})

module.exports = mongoose.models.Post || mongoose.model('Post', PostSchema);