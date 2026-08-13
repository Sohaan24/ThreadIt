const express = require("express") ;
const router = express.Router() ;
const Comment = require("../Models/CommentModel") ;
const mongoose  = require("mongoose");
const PostModel = require("../Models/PostModel");
const requireAuth = require("../Middleware/requireAuth") ;
const wrapAsync = require("../Utils/wrapAsync") ;



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

    await PostModel.findByIdAndUpdate(postId, {$inc : {commentCount : 1}}) ;

    const savedComment = await Comment.create({
        text,
        postId,
        parentId : parentId || null ,
        authorName : req.user.username,
        author : req.user.id 
        
    });
    res.status(201).json(savedComment) ;
}));


router.get("/getThread/:postId",wrapAsync (async(req, res)=> {
    const {postId} = req.params ;

   const comments = await Comment.find({postId}).sort({createdAt : -1}).lean() ;

   const commentMap = {} ;
   const rootComments = [] ;

   comments.forEach(c => {c.replies = [] ;
    commentMap[c._id.toString()] = c ;
    
   }) ;

   comments.forEach(c=> {
    if(c.parentId) {
        const parent = commentMap[c.parentId.toString()] ;

        if(parent) {
            parent.replies.push(c) ;
        }
    }else {
        rootComments.push(c) ;
        }
   }) ;

   res.status(200).json(rootComments) ;
}));

router.patch("/vote/:commentId",requireAuth, wrapAsync (async (req, res) => {
  const { commentId } = req.params;
  const { voteType } = req.body;
  const userId = req.user.id;

  const comment = await Comment.findById(commentId);
  if (!comment) return res.status(404).json({ error: "comment not found" });

  const hasUpvoted = comment.upvotedBy.includes(userId);
  const hasDownvoted = comment.downvotedBy.includes(userId);

  let updateQuery = {};

  if (voteType === "up") {
    if (hasUpvoted) {
      updateQuery = { $pull: { upvotedBy: userId } };
    } else {
      updateQuery = {
        $push: { upvotedBy: userId },
        $pull: { downvotedBy: userId },
      };
    }
  } else if (voteType === "down") {
    if (hasDownvoted) {
      updateQuery = { $pull: { downvotedBy: userId } };
    } else {
      updateQuery = {
        $push: { downvotedBy: userId },
        $pull: { upvotedBy: userId },
      };
    }
  }
  const updatedComment = await Comment.findByIdAndUpdate(commentId, updateQuery, {
    returnDocument: 'after',
  });

  return res.status(200).json({
    upvoteCount:  updatedComment.upvotedBy.length,
    downvoteCount:  updatedComment.downvotedBy.length,
    hasUpvoted: updatedComment.upvotedBy.includes(userId),
    hasDownvoted: updatedComment.downvotedBy.includes(userId),
  });
}));

router.patch("/deleteThread/:commentId",requireAuth, wrapAsync (async(req,res)=> {
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
        {returnDocument: 'after', runValidators: true },
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
        {returnDocument: 'after', runValidators: true },
    ) ;

    if(!updatedThread) {
        return res.status(404).json({error : "Comment not found"}) ;
    }

    res.status(200).json(updatedThread) ;

}));

module.exports = router ;

