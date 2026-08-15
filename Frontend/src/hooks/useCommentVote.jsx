import { useState, useContext, useEffect } from "react";
import api from "../Components/axiosConfig";
import { MyContext } from "../Components/MyContext";
import {toast} from "react-toastify"
export default function useVote(comment) {
  const { user } = useContext(MyContext);

  const [upvoteCount, setUpvoteCount] = useState(comment?.upvotedBy?.length || 0);
  const [downvoteCount, setDownvoteCount] = useState(
    comment?.downvotedBy?.length || 0,
  );

  const [hasUp, setHasUp] = useState(false);
  const [hasDown, setHasDown] = useState(false);

  useEffect(() => {
    if (!comment) return;

    setUpvoteCount(comment.upvotedBy?.length || 0);
    setDownvoteCount(comment.downvotedBy?.length || 0);

    if (!user) {
      setHasUp(false);
      setHasDown(false);
      return;
    }

    setHasUp(comment.upvotedBy.includes(user.id) ?? false);
    setHasDown(comment.downvotedBy.includes(user.id) ?? false);
  }, [comment, user]);

  const handleVote = async (type) => {
    if (!user) {
      toast.warning("Please log in to vote") ;
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
      const response = await api.patch(`/api/comment/vote/${comment._id}`, {
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

  return { upvoteCount, downvoteCount, hasUp, hasDown, handleVote};
}
