import api from "../axiosConfig";
import { useEffect, useState } from "react";
import CommentNode from "./CommentNode";

export default function RenderComment({ postId }) {
  const [postComments, setPostComments] = useState([]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await api.get(`/api/comment/getThread/${postId}`);
        console.log("fetchedComments", response.data) ;
        setPostComments(response.data);
      } catch (err) {
        console.log("Cannot fetch Comments", err);
      }
    };

    fetchComments();
  }, [postId]);

  return (
    <>
      {postComments.map((comment) => (
        <CommentNode key={comment._id} comment={comment} />
      ))}
    </>
  );
}
