import { useState, useContext, useEffect } from "react";
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

import ArrowUpwardSharpIcon from "@mui/icons-material/ArrowUpwardSharp";
import ArrowDownwardSharpIcon from "@mui/icons-material/ArrowDownwardSharp";
import ModeCommentIcon from "@mui/icons-material/ModeComment";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";


export default function PostPage({ post, onDelete }) {
  const { user } = useContext(MyContext);

  const [upvoteCount, setUpvoteCount] = useState(post?.upvotedBy?.length || 0);
  const [downvoteCount, setDownvoteCount] = useState(post?.downvotedBy?.length || 0);

  const [hasUp, setHasUp] = useState(false);
  const [hasDown, setHasDown] = useState(false);
  const navigate = useNavigate()

  useEffect(()=> {
    if(!post) return ;
    

    setUpvoteCount(post.upvotedBy?.length || 0) ;
    setDownvoteCount(post.downvotedBy?.length || 0) ; 

    if (!user) {
      setHasUp(false ) ;
      setHasDown(false) ;
      return;
    }

    setHasUp(post.upvotedBy.includes(user.id) ?? false) ;
    setHasDown(post.downvotedBy.includes(user.id) ?? false) ;
    

  },[post, user])

  const handleVote = async (type) => {
    if (!user) {
      console.log("please log in to vote");
      return;
    }
    const prevUp = upvoteCount;
    const prevDown = downvoteCount;
    const prevHasUp = hasUp;
    const prevHasDown = hasDown;

    if (type === "up") {
      if (hasUp) {
        setUpvoteCount((prev) => prev - 1);
        setHasUp(false);
      } else {
        setUpvoteCount((prev) => prev + 1);
        setHasUp(true);
      }

      if (hasDown) {
        setHasDown(false);
      }
    } else {
      if (type === "down") {
        if (hasDown) {
          setHasDown(false);
        } else {
          setHasDown(true);
        }

        if (hasUp) {
          setHasUp(false);
          setUpvoteCount((prev) => prev - 1);
        }
      }
    }

    try {
      const response = await api.patch(`/api/post/vote/${post._id}`, {
        voteType: type,
      });

      const data = response.data;

      setUpvoteCount(data.upvoteCount);
      setDownvoteCount(data.downvoteCount);
      setHasUp(data.hasUpvoted);
      setHasDown(data.hasDownvoted);
    } catch (error) {
      console.log("failed to update votes", error);

      setUpvoteCount(prevUp);
      setDownvoteCount(prevDown);
      setHasUp(prevHasUp);
      setHasDown(prevHasDown);
    }
  };

  function stringToColor(string) {
    let hash = 0;
    let i;

    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = "#";

    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }

    return color;
  }
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
  function timeAgo(dateString) {
    if (!dateString) return "Just now";

    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    let interval = Math.floor(seconds / 31536000);
    if (interval >= 1)
      return interval + " year" + (interval === 1 ? "" : "s") + " ago";

    interval = Math.floor(seconds / 2592000);
    if (interval >= 1)
      return interval + " month" + (interval === 1 ? "" : "s") + " ago";

    interval = Math.floor(seconds / 86400);
    if (interval >= 1)
      return interval + " day" + (interval === 1 ? "" : "s") + " ago";

    interval = Math.floor(seconds / 3600);
    if (interval >= 1)
      return interval + " hour" + (interval === 1 ? "" : "s") + " ago";

    interval = Math.floor(seconds / 60);
    if (interval >= 1)
      return interval + " min" + (interval === 1 ? "" : "s") + " ago";

    return "Just now";
  }
  return (
    <>
      <Card sx={{ mb: 3, borderRadius: 2, boxShadow: 0 , transition: "box-shadow 0.2s ease, transform 0.2s ease",
      "&:hover": {
        boxShadow: 4, 
      }, }}>
        <CardHeader
          avatar={
            <Avatar sx={{ bgcolor: stringToColor(username), color: "#FFFFFF" }}>
              {username.charAt(0).toUpperCase()}
            </Avatar>
          }
          title={username}
          subheader={timeAgo(post?.createdAt)}
          action={
            post?.author?._id === user?.id ? (
              <Box sx={{ gap: 3 }}>
                <IconButton onClick={()=> navigate(`/edit-post/${post._id}`)}>
                  <ModeEditIcon />
                </IconButton>
                <IconButton>
                  <DeleteIcon
                    sx={{ color: "red" }}
                    onClick={handleDeletePost}
                  />
                </IconButton>
              </Box>
            ) : null
          }
        />
        <Divider sx={{ mb: 1 }} />
        {post?.caption && (
          <CardContent>
            <Typography variant="h6">{post.caption}</Typography>
          </CardContent>
        )}

        {post?.imageUrl && (
          <CardMedia
            component="img"
            sx={{
              maxHeight: "250px",
              objectFit: "contain",
              bgcolor: "black",
              mb: 2,
              p: 2,
            }}
            image={post.imageUrl}
            alt="User uploaded image"
          />
        )}
        {post?.content && (
          <CardContent>
            <Typography variant="body1" color="text.secondary">
              {post.content}
            </Typography>
          </CardContent>
        )}

        <CardActions
          sx={{ display: "flex", justifyContent: "space-between", px: 2 }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton
              size="small"
              onClick={() => handleVote("up")}
              sx={{ color: hasUp ? "#FF4500" : "#878A8C" }}
            >
              <ArrowUpwardSharpIcon fontSize="small" />
            </IconButton>
            {upvoteCount}
            <IconButton
              size="small"
              onClick={() => handleVote("down")}
              sx={{ color: hasDown ? "#FF4500" : "#878A8C" }}
            >
              <ArrowDownwardSharpIcon fontSize="small" />
            </IconButton>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton size="small">
              <ModeCommentIcon fontSize="small" />
            </IconButton>
          </Box>
        </CardActions>
      </Card>
    </>
  );
}
