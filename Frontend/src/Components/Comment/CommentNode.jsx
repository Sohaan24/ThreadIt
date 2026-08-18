import { Box, Avatar,Typography, IconButton,  Collapse } from "@mui/material";
import { useContext,useState } from "react";
import { MyContext } from "../MyContext";
import useHelper from "../../utils/useHelper";
import CommentForm from "./CommentForm" ;
import useCommentVote from "../../hooks/useCommentVote" ;
import api from "../axiosConfig" ;
import {socket} from "../../utils/socket" ;
import {
  ArrowBigUp,
  ArrowBigDown,
  Pen,
  Trash2,
} from "lucide-react";

export default function CommentNode({ comment, onReplyAdded, depth= 0 , onCommentDeleted, onCommentEdited}) {
  const {user} = useContext(MyContext);
  const [clickReply, setClickReply] = useState(false) ;
   const [collapsed, setCollapsed] = useState(false);
   const [isEditing, setIsEditing] = useState(false) ;
  const {countReplies} = useHelper() ;

  const replyCount = countReplies(comment);
  
  const gutterWidth = depth < 4 ? 14 : 6;

  const handleReplySuccess = (newComment) => {
    onReplyAdded?.(comment._id, newComment);
    setClickReply(false);
  };

  const { timeAgo, stringToColor } = useHelper();
  const {hasUp, hasDown,upvoteCount, handleVote} = useCommentVote(comment) ;

  const handleCommentDelete = async()=>{
    try{
        await api.patch(`/api/comment/deleteThread/${comment._id}`) ;
        onCommentDeleted(comment._id);

        socket.emit("delete-comment", {
          postId : comment.postId ,
          commentId : comment._id ,
        }) 
    }catch(err) {
      console.log("Error in deleting comment", err) ;
    } 
  }

  return (
    <Box sx={{
      width: "100%",
      bgcolor: depth === 0 ? "#FFFFFF" : "transparent",
      border: depth === 0 ? "1px solid #EDEFF1" : "none",
      borderRadius: depth === 0 ? 2 : 0,
      p: depth === 0 ? 1.5 : 0,
      mb: depth === 0 ? 1 : 0,
    }}>
      <Box sx={{ display: "flex", gap: 1 }}>
      
  
        <Box
          onClick={() => setCollapsed((c) => !c)}
          sx={{
            width: gutterWidth,
            flexShrink: 0,
            display: "flex",
            justifyContent: "center",
            cursor: "pointer",
            "&:hover .thread-line": { bgcolor: "#FF4500" },
          }}
        >
          <Box
            className="thread-line"
            sx={{
              width: "2px",
              bgcolor: "#EDEFF1",
              borderRadius: 1,
              transition: "background-color 0.15s ease",
            }}
          />
        </Box>

        <Box sx={{ flex: 1, minWidth: 0, pb: 1.25 }}>
          {/* meta row */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Avatar
              sx={{
                bgcolor: stringToColor(comment.authorName),
                width: 22,
                height: 22,
                fontSize: "0.72rem",
                fontWeight: 700,
              }}
            >
              {comment.authorName.charAt(0).toUpperCase() == '[' ? 'U' : comment.authorName.charAt(0).toUpperCase() }
            </Avatar>
            <Typography sx={{ fontWeight: 700, fontSize: "0.85rem", color: "#1A1A1B" }}>
              {comment.authorName}
            </Typography>
            <Typography sx={{ fontSize: "0.78rem", color: "#818384" }}>
              &bull; {timeAgo(comment.createdAt)}
            </Typography>

            {collapsed && (
              <Typography sx={{ fontSize: "0.78rem", color: "#818384", fontStyle: "italic" }}>
                ({replyCount} {replyCount === 1 ? "reply" : "replies"} hidden)
              </Typography>
            )}

            {user && comment.author === user.id && (
              <Box sx={{ display: "flex", gap: 0.5, ml: "auto" }}>
                <IconButton size="small" disableRipple sx={{ color: "#818384", "&:hover": { color: "#FF4500" } }} onClick={() => setIsEditing(true)}>
                  <Pen size={14} />
                </IconButton>
                <IconButton size="small" disableRipple sx={{ color: "#818384", "&:hover": { color: "#E53935" } }} onClick={handleCommentDelete}>
                  <Trash2 size={14} />
                </IconButton>
              </Box>
            )}
          </Box>

          <Collapse in={!collapsed}>
            {isEditing ? (

        <CommentForm
          initialText = {comment.text} 
          isEditMode = {true} 
          onSubmit = { async (newText)=> {
            await api.patch(`/api/comment/updateThread/${comment._id}`,{text : newText}) ;

            onCommentEdited(comment._id, newText);
            socket.emit("edit-comment", {
              postId : comment.postId,
              commentId : comment._id ,
              text : newText  
            })
            setIsEditing(false);
          }}
          onCancel={() => setIsEditing(false)}
         />
      ) : <Typography
              sx={{
                fontSize: "0.95rem",
                lineHeight: 1.5,
                color: "#1A1A1B",
                mt: 0.5,
                ml: "30px",
              }}
            >
              {comment.text}
            </Typography>}
            

            <Box sx={{ display: "flex", alignItems: "center", gap: 0.25, mt: 0.5, ml: "26px" }}>
              <IconButton
                size="small"
                onClick={(e) => { e.stopPropagation(); handleVote("up"); }}
                sx={{ color: hasUp ? "#FF4500" : "#878A8C", p: 0.5 }}
              >
                <ArrowBigUp size={16} fill={hasUp ? "#FF4500" : "none"} />
              </IconButton>
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: "0.78rem",
                  minWidth: "1.5ch",
                  textAlign: "center",
                  color: hasUp ? "#FF4500" : hasDown ? "#7193FF" : "#1A1A1B",
                }}
              >
                {upvoteCount}
              </Typography>
              <IconButton
                size="small"
                onClick={(e) => { e.stopPropagation(); handleVote("down"); }}
                sx={{ color: hasDown ? "#7193FF" : "#878A8C", p: 0.5 }}
              >
                <ArrowBigDown size={16} fill={hasDown ? "#7193FF" : "none"} />
              </IconButton>

              <Typography
                onClick={() => setClickReply((v) => !v)}
                sx={{
                  ml: 1,
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  color: "#818384",
                  cursor: "pointer",
                  "&:hover": { color: "#1A1A1B" },
                }}
              >
                Reply
              </Typography>
            </Box>

            {clickReply && (
              <Box sx={{ ml: "26px", mt: 1 }}>
                <CommentForm
                  postId={comment.postId}
                  parentId={comment._id}
                  onCommentAdded={handleReplySuccess}
                  
                />
              </Box>
            )}

            {comment.replies?.length > 0 && (
              <Box sx={{ mt: 1 }}>
                {comment.replies.map((reply) => (
                  <CommentNode
                    key={reply._id}
                    comment={reply}
                    onReplyAdded={onReplyAdded}
                    depth={depth + 1}
                    onCommentDeleted={onCommentDeleted} 
                    onCommentEdited={onCommentEdited}
                    
                    
                  />
                ))}
              </Box>
            )}
          </Collapse>
        </Box>
      </Box>
    </Box>
  );
}
