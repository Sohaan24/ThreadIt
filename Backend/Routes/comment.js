const express = require("express") ;
const router = express.Router() ;
const Comment = require("../Models/CommentModel") ;
const mongoose  = require("mongoose");
const PostModel = require("../Models/PostModel");
const requireAuth = require("../Middleware/requireAuth") ;
const wrapAsync = require("../Utils/wrapAsync") ;


router.get("/getThread/:postId",wrapAsync (async(req, res)=> {
   try {
    const topComments = await Comment.aggregate([
        
        {
            $match : {
                postId : new mongoose.Types.ObjectId(req.params.postId),
                parentId : null, 
            }
        },
        {$sort : {_id : -1}},
        {$limit : 10},

        {
            $lookup : {
                from : "comments",
                let : {"currId" : "$_id"},

                pipeline :[
                    {
                        $match : {
                            $expr : {$eq : ["$parentId", "$$currId"]},
                        },
                    },

                    {$sort : {_id : -1}} ,
                    {$limit : 3} ,

                    {
                        $project : {
                            text : 1, authorName : 1, upvote : 1, createdAt : 1
                        },
                        
                    }
                ],
                as : "replies",
            }
        },
        {
            $project : {
                text : 1, authorName : 1, upvote : 1, replies : 1, createdAt : 1
            }
        }
    ]);

    res.status(200).json(topComments);

   }catch(err){
    res.status(500).json({error : err.message}) ;
   }
}));

router.post("/createThread", requireAuth,wrapAsync (async(req,res)=> {

    const {text, parentId, postId} = req.body ;

    if(!postId || !text) return res.status(404).json({error : "text and post is not found"}) ;

    const post = await PostModel.findById(postId) ;
    if(!post) return res.status(404).json({error : "post doesn't exist"}) ;

    if(parentId) {

        const parentComment = await Comment.findById(parentId) ;
        if(!parentComment) return res.status(404).json({error :"parent Comment doesn't exist"}) ;

        if(parentComment.postId.toString() !== postId){
            res.status(400).json({error : "data breach attempt : parent comment belongs to different post"}) ;
        }
        
    }

    const savedComment = await Comment.create({
        text,
        postId,
        parentId : parentId || null ,
        authorName : req.user.username,
        author : req.user.id 
        
    });
    res.status(201).json(savedComment) ;
}));

router.delete("/deleteThread/:commentId",requireAuth, wrapAsync (async(req,res)=> {
    const {commentId} = req.params ;
    const user = req.user.id ;

    const comment = await Comment.findById(commentId) ;
    if(comment.author.toString() != user) {
        res.status(401).json({error : "You cannot delete other person's comment"}) ;
    }

    const deletedThread = await Comment.findByIdAndUpdate(commentId, 
        {
            text : "[deleted]",
            authorName : "[deleted]"
        },
        {new :true }
    ) ;

    if(!deletedThread) {
        return res.status(404).json("message : comment not found") ;
    }
    

    res.status(200).json({message : "Thread deleted successfully", comment : deletedThread}) ;
}));

router.patch("/updateThread/:commentId",requireAuth, wrapAsync (async(req,res)=> {
    const {commentId} = req.params ;
    const {text} = req.body ;
    
    const user = req.user.id ;
    const comment = await Comment.findById(commentId) ;

    if(comment.author.toString() != user) {
        res.status(401).json({error : "You cannot delete other person's comment"}) ;
    } 
    const updatedThread = await Comment.findByIdAndUpdate(commentId, 
        
        {text},
        {
            new : true,
            runValidators : true,
        }
    ) ;

    if(!updatedThread) {
        return res.status(404).json({error : "Comment not found"}) ;
    }

    res.status(200).json(updatedThread) ;

}));

module.exports = router ;

