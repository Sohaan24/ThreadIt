import { useState, useContext, useRef } from "react";
import api from "../axiosConfig";
import { MyContext } from "../MyContext";
import { Box, Avatar, TextField, Button, CircularProgress, Typography } from "@mui/material";
import { Send } from "lucide-react";
import useHelper from "../../utils/useHelper";

export default function CommentForm({ postId, parentId = null, onCommentAdded,initialText = "", isEditMode = false, onSubmit, onCancel }) {
  const { user } = useContext(MyContext);
  const { stringToColor } = useHelper();
  const [text, setText] = useState("");
  const [focused, setFocused] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const inputRef = useRef(null);

  const username = user?.username || "You";
  const isEmpty = !text.trim();
  const isReply = Boolean(parentId); 

  const handleCancel = () => {
    setText(initialText); 
    setFocused(false);
    inputRef.current?.blur();
    if (onCancel) onCancel(); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEmpty || submitting) return;

    setSubmitting(true);
    try {
      if (isEditMode) {
        
        await onSubmit(text.trim());
      } else {
        
        const res = await api.post(`/api/comment/createThread`, {
          postId,
          parentId,
          text: text.trim(),
        });
        onCommentAdded?.(res.data);
        setText("");
        setFocused(false);
      }
    } catch (error) {
      console.log("failed to post/edit comment", error);
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) {
    return (
      <Box
        sx={{
          bgcolor: "#F5F6F8",
          border: "1px dashed #D0D5DD",
          borderRadius: 2.5,
          px: 2.5,
          py: 2,
          textAlign: "center",
          mb: 2,
        }}
      >
        <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: "0.9rem", color: "#667085" }}>
          Log in to join the discussion
        </Typography>
      </Box>
    );
  }

  return (
   <Box
  component="form"
  onSubmit={handleSubmit}
  sx={{
    display: "flex",
    gap: isReply ? 1 : 1.5,
    alignItems: focused ? "flex-start" : "center",
    width: "100%",
    mb: isReply ? 1 : 2,
  }}
>
  <Avatar
    sx={{
      bgcolor: stringToColor(username),
      width: isReply ? 22 : 28,
      height: isReply ? 22 : 28,
      fontWeight: 700,
      fontSize: isReply ? "0.72rem" : "0.8rem",
      mt: focused ? 0.5 : 0,
      flexShrink: 0,
    }}
  >
    {username.charAt(0).toUpperCase()}
  </Avatar>

  <Box
    sx={{
      flex: 1,
      minWidth: 0,
      border: "1px solid",
      borderColor: focused ? "#FF4500" : "#EDEFF1",
      borderRadius: isReply ? 2 : 2.5,
      px: isReply ? 1.25 : 1.75,
      py: isReply ? 0.75 : 1.1,
      transition: "border-color 0.15s ease",
      bgcolor: "#FFFFFF",
    }}
  >
    <TextField
      inputRef={inputRef}
      value={text}
      onChange={(e) => setText(e.target.value)}
      onFocus={() => setFocused(true)}
      placeholder={isReply ? "Reply..." : "Join the conversation"}
      multiline
      minRows={focused ? 2 : 1}
      fullWidth
      variant="standard"
      InputProps={{ disableUnderline: true }}
      sx={{
        fontFamily: "'Inter', sans-serif",
        fontSize: isReply ? "0.85rem" : "0.95rem",
        color: "#1A1A1B",
        "& textarea": { lineHeight: 1.5 },
        "& textarea::placeholder": { color: "#818384", opacity: 1 },
      }}
    />

    {focused && (
      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 0.5, mt: 1 }}>
        <Button
          onClick={handleCancel}
          disabled={submitting}
          disableRipple
          size="small"
          sx={{
            textTransform: "none",
            fontFamily: "'Inter', sans-serif",
            fontWeight: 700,
            fontSize: "0.78rem",
            color: "#818384",
            borderRadius: 5,
            px: 1.5,
            "&:hover": { color: "#1A1A1B", bgcolor: "transparent" },
          }}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isEmpty || submitting}
          size="small"
          endIcon={submitting ? null : <Send size={13} />}
          sx={{
            textTransform: "none",
            fontFamily: "'Inter', sans-serif",
            fontWeight: 700,
            fontSize: "0.78rem",
            bgcolor: "#FF4500",
            color: "#FFFFFF",
            borderRadius: 5,
            px: isReply ? 1.75 : 2.25,
            "&:hover": { bgcolor: "#D33600" },
            "&.Mui-disabled": { bgcolor: "#EDEFF1", color: "#818384" },
          }}
        >
          {submitting ? (
            <CircularProgress size={13} sx={{ color: "#818384" }} />
          ) : isReply ? (
            "Reply"
          ) : (
            "Comment"
          )}
        </Button>
      </Box>
    )}
  </Box>
</Box>
  );
}