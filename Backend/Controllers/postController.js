const PostModel = require("../Models/PostModel");
const UserModel = require("../Models/UserModel") ;
const mongoose = require("mongoose");
const CommentModel = require("../Models/CommentModel");
const requireAuth = require("../Middleware/requireAuth") ;
const wrapAsync = require("../Utils/wrapAsync");
const upload = require("../Middleware/uploads") ;

module.exports.createPost = async (req, res) => {
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
}

module.exports.all = async (req,res)=> {

  const allPosts = await PostModel.find().sort({createdAt : -1}).populate("author", "username") ;

  res.status(200).json({posts: allPosts }) ;
}

module.exports.getPost = async(req,res)=> {
  const {postId} = req.params ;

  const Post = await PostModel.findById(postId).populate("author", "username") ;

  if(!Post) {
    return res.status(404).json({error : "Post Not found"}) ;
  }
  

  return res.status(200).json({msg : "post fetch successfully", post : Post}) ;
}

module.exports.editPost = async (req, res) => {
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
  
  let finalImageUrl ;

  if(req.body.removeImage === "true") {
    finalImageUrl = null ;
  }else if(req.file) {
    finalImageUrl = req.file.path ;
  }else {
    finalImageUrl = post.imageUrl ;
  }

  if(content && finalImageUrl) {
    return res.status(400).json({message : "Cannot add caption and Image Together"}) ;
  }

  if(!content && !finalImageUrl) {
    return res.status(400).json({message : "Content or Image is required"}) ;
  }
  
  const updatedPost = await PostModel.findByIdAndUpdate(
    postId,
    {
      content,
      caption: caption || "",
      imageUrl : finalImageUrl,
      author : user 
    },
    {returnDocument: 'after', runValidators: true },
  );

  if (!updatedPost)
    return res.status(404).json({ error: "unable to find post" });

  res.status(200).json({ post: updatedPost });
}

module.exports.vote = async (req, res) => {
  const { postId } = req.params;
  const { voteType } = req.body;
  const userId = req.user.id;

  const post = await PostModel.findById(postId);
  if (!post) return res.status(404).json({ error: "post not found" });

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
}

module.exports.deletePost = async (req, res) => {
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
}