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


import { ArrowBigUp, ArrowBigDown, MessageCircle, Pen, Trash2 } from 'lucide-react';


export default function PostPage({ post, onDelete }) {
  const { user } = useContext(MyContext);

  const [upvoteCount, setUpvoteCount] = useState(post?.upvotedBy?.length || 0);
  const [downvoteCount, setDownvoteCount] = useState(
    post?.downvotedBy?.length || 0,
  );

  const [hasUp, setHasUp] = useState(false);
  const [hasDown, setHasDown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!post) return;

    setUpvoteCount(post.upvotedBy?.length || 0);
    setDownvoteCount(post.downvotedBy?.length || 0);

    if (!user) {
      setHasUp(false);
      setHasDown(false);
      return;
    }

    setHasUp(post.upvotedBy.includes(user.id) ?? false);
    setHasDown(post.downvotedBy.includes(user.id) ?? false);
  }, [post, user]);

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
      <Card
        sx={{
          mb: 3,
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
          boxShadow: "none",
          overflow: "hidden",
          transition: "box-shadow 0.25s ease, transform 0.25s ease",
          "&:hover": {
            boxShadow: "0 12px 28px rgba(0,0,0,0.08)",
            transform: "translateY(-2px)",
          },
        }}
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
                  onClick={() => navigate(`/edit-post/${post._id}`)}
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
                  onClick={handleDeletePost}
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
              onClick={() => handleVote("up")}
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
              onClick={() => handleVote("down")}
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
            <IconButton size="small" sx={{ p: 0.3, color: "#878A8C" }}>
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
