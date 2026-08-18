import { useState, useEffect, useContext, useCallback } from "react";
import { Box, Typography } from "@mui/material";
import PostPage from "./PostPage";
import api from "./axiosConfig";
import { MyContext } from "./MyContext";
import { socket } from "../utils/socket";

export default function Feed() {
  const [allPosts, setAllPosts] = useState([]);
  const { query } = useContext(MyContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/api/post/all");
        setAllPosts(response.data.posts);
      } catch (error) {
        console.log("failed to fetch posts :", error);
      }
    };

    fetchData();
  }, []);

 
  const handleDeletePost = useCallback((deletedId) => {
    setAllPosts((prev) => prev.filter((p) => p._id !== deletedId));
  }, []);
  useEffect(() => {
    const handleCreatePost = (post)=> {

        setAllPosts(prev => [post, ...prev])
    }

    const handleEditPost = (updatedPost)=> {

      setAllPosts(prev => prev.map(p => p._id === updatedPost._id ? updatedPost : p )) ;
    }

    
    socket.on("post-created",handleCreatePost) ;
    socket.on("post-edited", handleEditPost) ;
    socket.on("post-deleted", handleDeletePost);

    return () => {
      socket.off("post-deleted", handleDeletePost);
      socket.off("post-created", handleCreatePost) ;
      socket.off("post-edited", handleEditPost) ;
    };
  }, [handleDeletePost]);



  const filterPost = allPosts.filter((post) => {
    return post.caption.toLowerCase().includes((query || "").toLowerCase());
  });

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexGrow: 1,
          color: "black",
          bgcolor: "#F5F6F7",
          p: { xs: 2, md: 4 },
          overflowY: "auto",
        }}
      >
        <Box sx={{ maxWidth: "500px", width: "100%", mx: "auto" }}>
          {filterPost.length > 0 ? (
            filterPost.map((post) => (
              <PostPage
                key={post._id}
                post={post}
                onDelete={handleDeletePost}
              />
            ))
          ) : (
            <Typography sx={{ textAlign: "center", mt: 4, color: "#818384" }}>
              No posts found matching "{query}"
            </Typography>
          )}
        </Box>
      </Box>
    </>
  );
}
