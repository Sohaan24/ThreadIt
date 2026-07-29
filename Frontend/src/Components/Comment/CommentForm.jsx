import { useState, useContext, useRef } from "react";
import api from "../axiosConfig";
import { MyContext } from "../MyContext";
import { Box, Avatar, TextField, Button, CircularProgress, Typography } from "@mui/material";
import { Send } from "lucide-react";
import useHelper from "../../utils/useHelper";

export default function CommentForm({ postId, parentId = null, onCommentAdded}) {
  const { user } = useContext(MyContext);
  const { stringToColor } = useHelper();
  const [text, setText] = useState("");
  const [focused, setFocused] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const inputRef = useRef(null);

  const username = user?.username || "You";
  const isEmpty = !text.trim();

  const handleCancel = () => {
    setText("");
    setFocused(false);
    inputRef.current?.blur();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEmpty || submitting) return;

    setSubmitting(true);
    try {
      const res = await api.post(`/api/comment/createThread`, {
        postId,
        parentId,
        text: text.trim(),
      });
      onCommentAdded?.(res.data.comment);
      console.log("Comment :", text) 
      setText("");
      setFocused(false);
    } catch (error) {
      console.log("failed to post comment", error);
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) {
    return (
      <Box sx={{ bgcolor: "#F5F6F8", border: "1px dashed #D0D5DD", borderRadius: 2.5, px: 2.5, py: 2, textAlign: "center" }}>
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
        gap: 1.5,
        alignItems: focused ? "flex-start" : "center",
        bgcolor: "#FFFFFF",
        border: "1px solid",
        borderColor: focused ? "#0F6E6A" : "#E4E7EC",
        borderRadius: 3,
        px: 2,
        py: 1.5,
        transition: "border-color 0.2s ease",
        width : "65%",
        mb : 2
      }}
    >
      <Avatar sx={{ bgcolor: stringToColor(username), width: 36, height: 36, fontWeight: 700, fontSize: "0.9rem", mt: focused ? 0.5 : 0 }}>
        {username.charAt(0).toUpperCase()}
      </Avatar>

      <Box sx={{ flex: 1 }}>
        <TextField
          inputRef={inputRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onFocus={() => setFocused(true)}
          placeholder={"Join the conversation"}
          multiline
          minRows={focused ? 2 : 1}
          fullWidth
          variant="standard"
          InputProps={{ disableUnderline: true }}
          sx={{ fontFamily: "'Inter', sans-serif", fontSize: "0.95rem", "& textarea": { lineHeight: 1.6 } }}
        />

        {focused && (
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 1 }}>
            <Button
              onClick={handleCancel}
              disabled={submitting}
              sx={{
                textTransform: "none",
                fontFamily: "'Inter', sans-serif",
                fontWeight: 600,
                color: "#667085",
                borderRadius: 5,
                px: 2,
                "&:hover": { bgcolor: "#F5F6F8" },
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isEmpty || submitting}
              endIcon={submitting ? null : <Send size={15} />}
              sx={{
                textTransform: "none",
                fontFamily: "'Inter', sans-serif",
                fontWeight: 700,
                bgcolor: "#FF4500",
                color: "#FFFFFF",
                borderRadius: 5,
                px: 2.5,
                "&:hover": { bgcolor : "#D33600"},
                "&.Mui-disabled": { bgcolor: "#E4E7EC", color: "#98A2B3" },
              }}
            >
              {submitting ? <CircularProgress size={16} sx={{ color: "#98A2B3" }} /> : "Comment"}
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
}