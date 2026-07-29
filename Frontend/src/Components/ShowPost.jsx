import PostPage from "./PostPage";
import api from "./axiosConfig";
import { MoveLeft } from "lucide-react";
import { IconButton, Box, CircularProgress } from "@mui/material";

import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import CommentForm from "./Comment/CommentForm" ;

export default function ShowPost() {
  const navigate = useNavigate();
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/api/post/getPost/${postId}`);
        setPost(res.data.post);
      } catch (error) {
        console.log("failed to fetch post", error);
        setPost(null);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [postId]);

  if (loading) return <CircularProgress />;
  if (!post) return <Box>Post not found</Box>;

  return (
    <Box sx={{height :"100vh"}}>
      <IconButton
        sx={{
          "&:hover": { color: "#FF4500" },
          
          position: "sticky",
          top : 16
          
        }}
        disableRipple
        
      >
        <MoveLeft onClick={() => navigate("/")} size={30} />
      </IconButton>

      <Box sx={{ width: "80%", display: "flex", alignItems : "center", mt : 5, flexDirection : "column"}}>
        <PostPage post={post} />
        <CommentForm postId = {post._id}/>
        
      </Box>
    </Box>
  );
}
