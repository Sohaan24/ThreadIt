import {useContext } from "react";
import api from "./axiosConfig";
import { MyContext } from "./MyContext";
import { useNavigate } from "react-router-dom";

import {
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  CardActions,
  Avatar,
  Typography,
  IconButton,
  Box,
  Divider,
} from "@mui/material";


import { ArrowBigUp, ArrowBigDown, MessageCircle, Pen, Trash2 } from 'lucide-react';
import useHelper from "../utils/useHelper" ;
import useVote from "../hooks/useVote" ;



export default function PostPage({ post, onDelete }) {
  const { user } = useContext(MyContext);
  const {hasUp,hasDown, upvoteCount,handleVote} = useVote(post) ;
  const navigate = useNavigate() ;
  const{timeAgo, stringToColor} = useHelper() ;


  const username = post?.author?.username || "Unknown";

  const handleDeletePost = async () => {
    console.log("post id ", post._id);
    try {
      await api.delete(`/api/post/delete/${post._id}`);
      onDelete(post._id);
    } catch (error) {
      console.log("Failed to delete Post", error);
    }
  };

  const showPost= ()=> {
   
    navigate(`/show-post/${post._id}`);
  }
  
  return (
    <>
      <Card
        sx={{
          mb: 3,
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
          boxShadow: "none",
          overflow: "hidden",
          transition: "box-shadow 0.25s ease, transform 0.25s ease",
          cursor : "pointer",
          "&:hover": {
            boxShadow: "0 12px 28px rgba(0,0,0,0.08)",
            transform: "translateY(-2px)",
          },
        }}
        onClick={showPost}
      >
        <CardHeader
          sx={{ pb: 1 }}
          
          avatar={
            <Avatar
              sx={{
                bgcolor: stringToColor(username),
                color: "#FFFFFF",
                fontWeight: 600,
                boxShadow: "0 0 0 2px #fff, 0 0 0 3px rgba(0,0,0,0.06)",
              }}
            >
              {username.charAt(0).toUpperCase()}
            </Avatar>
          }
          title={
            <Typography
              sx={{ fontWeight: 600, fontSize: "0.95rem", lineHeight: 1.3 }}
            >
              {username}
            </Typography>
          }
          subheader={
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              {timeAgo(post?.createdAt)}
            </Typography>
          }
          action={
            post?.author?._id === user?.id ? (
              <Box sx={{ display: "flex", gap: 0.5, pt: 0.5 }}>
                <IconButton
                  size="small"
                  
                  onClick={(e) =>{e.stopPropagation(); navigate(`/edit-post/${post._id}`)}}
                  sx={{
                    color: "text.secondary",
                    "&:hover": {
                      color: "primary.main",
                      bgcolor: "action.hover",
                    },
                  }}
                >
                  <Pen fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={(e)=> {e.stopPropagation(); handleDeletePost() }}
                  sx={{
                    color: "#E53935",
                    "&:hover": { bgcolor: "rgba(229,57,53,0.08)" },
                  }}
                >
                  <Trash2 fontSize="small" />
                </IconButton>
              </Box>
            ) : null
          }
        />

        {post?.caption && (
          <CardContent
            sx={{ pt: 0, pb: post?.imageUrl || post?.content ? 1 : 2 }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                fontSize: "1.05rem",
                lineHeight: 1.4,
                color: "text.primary",
              }}
            >
              {post.caption}
            </Typography>
          </CardContent>
        )}

        {post?.imageUrl && (
          <Box sx={{ px: 2, pb: post?.content ? 1 : 2 }}>
            <CardMedia
              component="img"
              sx={{
                maxHeight: 380,
                width: "100%",
                objectFit: "contain",
                bgcolor: "#00000008",
                borderRadius: 2,
              }}
              image={post.imageUrl}
              alt="User uploaded image"
            />
          </Box>
        )}

        {post?.content && (
          <CardContent sx={{ pt: 0 }}>
            <Typography
              variant="body1"
              sx={{
                color: "text.secondary",
                lineHeight: 1.7,
                fontSize: "0.95rem",
              }}
            >
              {post.content}
            </Typography>
          </CardContent>
        )}

        <Divider sx={{ opacity: 0.6 }} />

        <CardActions
          sx={{
            display: "flex",
            justifyContent: "space-between",
            px: 2,
            py: 1,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              bgcolor: "action.hover",
              borderRadius: 5,
              px: 0.5,
            }}
          >
            <IconButton
              size="small"
              onClick={(e) =>{e.stopPropagation() ; handleVote("up")} }
              sx={{
                color: hasUp ? "#FF4500" : "#878A8C",
                bgcolor: hasUp ? "rgba(255,69,0,0.12)" : "transparent",
              }}
            >
              <ArrowBigUp fontSize="small" />
            </IconButton>
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: "0.85rem",
                minWidth: "2ch",
                textAlign: "center",
                color: hasUp ? "#FF4500" : hasDown ? "#0079D3" : "text.primary",
              }}
            >
              {upvoteCount}
            </Typography>
            <IconButton
              size="small"
              onClick={(e) =>{e.stopPropagation(); handleVote("down") } }
              sx={{
                color: hasDown ? "#0079D3" : "#878A8C",
                bgcolor: hasDown ? "rgba(0,121,211,0.12)" : "transparent",
              }}
            >
              <ArrowBigDown fontSize="small" />
            </IconButton>
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              bgcolor: "action.hover",
              borderRadius: 5,
              px: 1.2,
              py: 0.3,
              cursor: "pointer",
              "&:hover": { bgcolor: "action.selected" },
            }}
          >
            <IconButton size="small" sx={{ p: 0.3, color: "#878A8C" }} onClick={(e)=> {e.stopPropagation();}}>
              <MessageCircle fontSize="small" />
            </IconButton>
            <Typography
              sx={{
                fontSize: "0.85rem",
                fontWeight: 600,
                color: "text.secondary",
              }}
            >
              {post?.commentCount ?? 0}
            </Typography>
          </Box>
        </CardActions>
      </Card>
    </>
  );
}
