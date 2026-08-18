import api from "../axiosConfig";
import { useEffect, useState, useCallback } from "react";
import CommentNode from "./CommentNode";
import CommentForm from "./CommentForm";
import { Box } from "@mui/material";
import {socket} from "../../utils/socket";

export default function RenderComment({ postId }) {
  const [postComments, setPostComments] = useState([]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await api.get(`/api/comment/getThread/${postId}`);
        setPostComments(response.data);
      } catch (err) {
        console.log("Cannot fetch Comments", err);
      }
    };
    fetchComments();
  }, [postId]);



  const handleCommentAdded = useCallback((parentId, newComment) => {

    const actualComment = newComment || parentId;
    const actualParentId = newComment ? parentId : null;


    const formattedComment = { ...actualComment, replies: [] };

    setPostComments((prevComments) => {
     
      if (!actualParentId) {
    
        return [formattedComment, ...prevComments];
      }

      const insertReplyIntoTree = (commentsList) => {
        return commentsList.map((c) => {
          if (c._id === actualParentId) {
            return {
              ...c,
              replies: [...(c.replies || []), formattedComment],
            };
          }

          if (c.replies && c.replies.length > 0) {
            return {
              ...c,
              replies: insertReplyIntoTree(c.replies),
            };
          }

          return c;
        });
      };

      return insertReplyIntoTree(prevComments);
    });
  }, []);

  const handleEdit = useCallback((commentId, newText)=> {
    setPostComments((prevComments)=> {

      const updateCommentInTree = (commentList)=> {

        return commentList.map((c)=> {

          if(c._id == commentId) {
            return {
              ...c,
              text : newText ,
              isEdited : true 
            }
          }

          if(c.replies.length && c.replies.length > 0) {
            return{
              ...c,
              replies : updateCommentInTree(c.replies) 
            } 
          }
          return c ;
        })
      }

      return updateCommentInTree(prevComments) ;
    })
  },[]) ;

  const handleDelete = (commentId)=> {
    setPostComments((prevComments)=> {

      const markAsDeletedInTree = (commentList)=> {
        return commentList.map((c)=> {
          if(c._id == commentId) {
            return {
              ...c,
              text : "[deleted]",
              authorName : "[deleted]",
              author : null 
            } ;
          }

          if(c.replies && c.replies.length > 0) {
            return {
              ...c,
              replies : markAsDeletedInTree(c.replies) ,
            }
          };

          return c ;
        });
      };
      return markAsDeletedInTree(prevComments) ;
    });
  }


  useEffect(()=> {
    if(!postId) return ;

    socket.emit("join the room", postId) ;

    const onCommentAdded = (data) => {
      handleCommentAdded(data.parentId, data.comment) 
    }

    const onCommentEdited = (data)=> {
      handleEdit(data.commentId, data.text) ;
    }

    const onCommentDeleted = (data)=> {
      handleDelete(data.commentId) ;
    }

    socket.on("comment-added",onCommentAdded) ;
    socket.on("edit-comment",onCommentEdited ) ;
    socket.on("delete-comment", onCommentDeleted) ;

    return ()=> {
      socket.off("comment-added", onCommentAdded) ;
      socket.emit("leave room", postId) ;
      socket.off("edit-comment", onCommentEdited) ;
      socket.off("delete-comment", onCommentDeleted) ;
    }
    
  },[postId, handleCommentAdded,handleEdit]) ;

  
  return (
    <Box sx={{ mt: 3 }}>
     
      <CommentForm 
        postId={postId} 
        onCommentAdded={handleCommentAdded} 
      />

      {postComments.map((comment) => (
        <CommentNode 
          key={comment._id} 
          comment={comment} 
          onReplyAdded={handleCommentAdded} 
          onCommentDeleted = {handleDelete}
          onCommentEdited={handleEdit}
        />
      ))}
    </Box>
  );
}