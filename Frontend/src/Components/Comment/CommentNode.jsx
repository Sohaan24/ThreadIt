import { Box, Avatar, Button, Typography, IconButton } from "@mui/material";
import { useContext } from "react";
import { MyContext } from "../MyContext";
import useHelper from "../../utils/useHelper";
import {
  ArrowBigUp,
  ArrowBigDown,
  MessageCircle,
  Pen,
  Trash2,
} from "lucide-react";

export default function CommentNode({ comment }) {
  const { user } = useContext(MyContext);

  const { timeAgo, stringToColor } = useHelper();

  return (
    <Box
      sx={{
        bgcolor: "#FFFFFF",
        boxShadow: 0,
        transition: "box-shadow 0.25s ease, transform 0.25s ease",
        "&:hover": {
          boxShadow: "0 12px 28px rgba(0,0,0,0.08)",
          transform: "translateY(-2px)",
        },
        borderRadius: 3,
        border: "1px solid",
        width: "65%",
        padding: 2,
        margin: 2,
      }}
    >
      <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
        <Avatar
          sx={{
            bgcolor: stringToColor(comment.authorName),
            width: "35px",
            height: "35px",
          }}
        >
          {comment.authorName.charAt(0).toUpperCase()}
        </Avatar>
        <Typography sx={{ fontWeight: 500 }}>{comment.authorName}</Typography>
        <Typography variant="caption" sx={{ opacity: 0.6, fontSize: "12px" }}>
          &bull;{timeAgo(comment.createdAt)}
        </Typography>

        {user && comment.author === user._id ?
        <Box sx={{ marginLeft: "auto", marginRight : "1rem" }}>
          <IconButton
            size="small"
            disableRipple
            sx={{
              color: "text.secondary",
              "&:hover": {
                color: "primary.main",
                bgcolor: "action.hover",
              },
            }}
          >
            <Pen />
          </IconButton>

          <IconButton
            size="small"
            disableRipple
            sx={{
              color: "#E53935",
              "&:hover": { bgcolor: "rgba(229,57,53,0.08)" },
            }}
          >
            <Trash2 sx={{ color: "red" }} />
          </IconButton>
        </Box> : null
        } 
        
      </Box>
      <Typography
        sx={{
          fontWeight: 100,
          lineHeight: 1.5,
          pt: 2,
          fontSize: "1.2rem",
          marginLeft: 5,
        }}
      >
        {comment.text}
      </Typography>

      {comment.replies && comment.replies.length > 0 && (
        <Box sx={{ pl: 4, borderLeft: "2px solid #e0e0e0", mt: 2 }}>
          {comment.replies.map((reply) => (
            <CommentNode key={reply._id} comment={reply} />
          ))}
        </Box>
      )}
    </Box>
  );
}
