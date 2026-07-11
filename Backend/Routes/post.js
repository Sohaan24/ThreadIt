const express = require("express");
const router = express.Router();
const PostModel = require("../Models/PostModel");
const UserModel = require("../Models/UserModel") ;
const mongoose = require("mongoose");
const CommentModel = require("../Models/CommentModel");
const requireAuth = require("../Middleware/requireAuth") ;
const wrapAsync = require("../Utils/wrapAsync");
const upload = require("../Middleware/uploads") ;


router.post("/createPost",requireAuth, upload.single("image"), wrapAsync (async (req, res) => {
  const { content, caption } = req.body;

  let imageUrl ;

  if(req.file) {
    imageUrl = req.file.path ;
  }

  if (!content && !imageUrl) {
    return res.status(400).json({ error: "Post must have content or the Image" });
  }

  if(content && imageUrl) {
    return res.status(400).json({error : "Post must have either content or the Image "})
  }

  const savedPost = await PostModel.create({
    content : content || "",
    caption: caption || "",
    author: req.user.id,
    imageUrl : imageUrl || ""
  });

  
  res
    .status(201)
    .json({ message: "post created successfully", post: savedPost });
}));



router.get("/getPost/:userId",wrapAsync (async (req, res) => {
  const { userId } = req.params;

  const user = await UserModel.findById(userId) ;
  if(!user){
    return res.status(404).json({error : "User does not exist"}) ;
  }
  const allPosts = await PostModel.find({ author : userId}).sort({createdAt : -1});

  res
    .status(200)
    .json({ message: "successfully fetch posts", posts: allPosts });
}));


router.get("/all", wrapAsync(async (req,res)=> {

  const allPosts = await PostModel.find().sort({createdAt : -1}).populate("author", "username") ;

  res.status(200).json({posts: allPosts }) ;
}))

router.put("/update/:postId",requireAuth, upload.single("image"),wrapAsync (async (req, res) => {
  const { postId } = req.params;
  const { content, caption } = req.body;
  const user = req.user.id ;

  const post = await PostModel.findById(postId) ;

  if(!post) {
    return res.status(404).json({error : "Post not Found"}) ;
  }

  if(post.author.toString() != user) {
    return res.status(401).json({error : "Unauthorized access , You cannot edit another user's Post"}) ;
  }
  
  let imageUrl ;
  if(req.file) {
    imageUrl = req.file.path ;
  }

  if(content && imageUrl) {
    return res.status(400).json({message : "Cannot add caption and Image Together"}) ;
  }

  if(!content && !imageUrl) {
    return res.status(400).json({message : "Content or Image is required"}) ;
  }
  
  
  const updatedPost = await PostModel.findByIdAndUpdate(
    postId,
    {
      content,
      caption: caption || "",
      imageUrl : imageUrl || "" ,
      author : user 
    },
    {returnDocument: 'after', runValidators: true },
  );

  if (!updatedPost)
    return res.status(404).json({ error: "unable to find post" });

  res.status(200).json({ post: updatedPost });
}));


router.patch("/vote/:postId",requireAuth, wrapAsync (async (req, res) => {
  const { postId } = req.params;
  const { voteType } = req.body;
  const userId = req.user.id;

  const post = await PostModel.findById(postId);
  if (!post) return status(404).json({ error: "post not found" });

  const hasUpvoted = post.upvotedBy.includes(userId);
  const hasDownvoted = post.downvotedBy.includes(userId);

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
  const updatedPost = await PostModel.findByIdAndUpdate(postId, updateQuery, {
    returnDocument: 'after',
  });

  return res.status(200).json({
    upvoteCount: updatedPost.upvotedBy.length,
    downvoteCount: updatedPost.downvotedBy.length,
    hasUpvoted: updatedPost.upvotedBy.includes(userId),
    hasDownvoted: updatedPost.downvotedBy.includes(userId),
  });
}));


router.delete("/delete/:postId", requireAuth, wrapAsync (async (req, res) => {
  const { postId } = req.params;
 
  const user = req.user.id ;
  
  const post = await PostModel.findById(postId) ;

  if(!post) {
    return res.status(404).json({error : "Post not Found"}) ;
  }

  if(post.author.toString() !== user) {
    return res.status(401).json({error : "Unauthorized access , You cannot delete another user's Post"}) ;
  }
  await CommentModel.deleteMany({ postId: postId });

  const deletedPost = await PostModel.findByIdAndDelete(postId);

  if (!deletedPost) {
    return res.status(404).json({ error: "unable to find the post" });
  }

  res.status(200).json({ message: "post and comment assosicated with the post are deleted successfully" });
}));

module.exports = router ;
