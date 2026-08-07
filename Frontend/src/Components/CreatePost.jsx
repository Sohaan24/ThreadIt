import { useContext, useState} from "react";
import { MyContext } from "./MyContext";
import { Formik } from "formik";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Button,
  Divider,
  Avatar,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import ImageIcon from "@mui/icons-material/Image";
import TextFieldsIcon from "@mui/icons-material/TextFields";
import * as Yup from "yup";
import api from "./axiosConfig";
import {toast} from "react-toastify" ;

export default function CreatePost() {
  const { user } = useContext(MyContext);
  const [activeTab, setActiveTab] = useState("text"); // "text" | "image"
  const [previewUrl, setPreviewUrl] = useState(null);
  const navigate = useNavigate() ;
  console.log(user) ;
  if (!user) {
    return (
      <Box
        sx={{
          mt: 10,
          textAlign: "center",
          color: "#818384",
        }}
      >
        <Typography variant="h5">
          You must be logged in to create a post.
        </Typography>
      </Box>
    );
  }

  const createPostValidation = Yup.object().shape(
    {
      content: Yup.string().when("image", {
        is: (image) => image && image !== undefined,
        then: (schema) =>
          schema.test(
            "is-empty",
            "Provide content or an image — not both",
            (value) => !value || value.trim() === ""
          ),
        otherwise: (schema) =>
          schema.required("Provide some content or upload an image"),
      }),
      image: Yup.mixed().nullable().when("content", {
        is: (content) => content && content.trim() !== "",
        then: (schema) =>
          schema.test(
            "is-empty",
            "Provide content or an image — not both",
            (value) => value === null || value === undefined
          ),
        otherwise: (schema) =>
          schema.required("Provide some content or upload an image"),
      }),
    },
    [["content", "image"]]
  );

  const tabs = [
    { key: "text", label: "Text", icon: <TextFieldsIcon fontSize="small" /> },
    { key: "image", label: "Image", icon: <ImageIcon fontSize="small" /> },
  ];

  return (
    <Box
      sx={{
        width: { xs: "100%", sm: 580 },
        mx: "auto",
        mt: 4,
        px: { xs: 2, sm: 0 },
      }}
    >
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
        <Avatar
          sx={{
            bgcolor: "#FF4500",
            width: 38,
            height: 38,
            fontSize: 15,
            fontWeight: 700,
          }}
        >
          {user?.username?.[0]?.toUpperCase() || "U"}
        </Avatar>
        <Box>
          <Typography
            variant="caption"
            sx={{ color: "#818384", display: "block", lineHeight: 1.2 }}
          >
            Posting as
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "#FF4500", fontWeight: 600 }}
          >
            {user?.username}
          </Typography>
        </Box>
      </Box>

      {/* Card */}
      <Box
        sx={{
          bgcolor: "#ffffff",
          border: "1px solid #edeff1",
          borderRadius: 2,
          overflow: "hidden",
          boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
        }}
      >
        {/* Tabs */}
        <Box sx={{ display: "flex", borderBottom: "1px solid #edeff1" }}>
          {tabs.map((tab) => (
            <Button
              key={tab.key}
              disableRipple
              onClick={() => setActiveTab(tab.key)}
              startIcon={tab.icon}
              sx={{
                flex: 1,
                py: 1.4,
                borderRadius: 0,
                fontSize: 13,
                fontWeight: 600,
                color: activeTab === tab.key ? "#FF4500" : "#878a8c",
                borderBottom:
                  activeTab === tab.key
                    ? "2px solid #FF4500"
                    : "2px solid transparent",
                bgcolor: "transparent",
                textTransform: "none",
                "&:hover": {
                  bgcolor: "#f6f7f8",
                  color: activeTab === tab.key ? "#FF4500" : "#1c1c1c",
                },
                transition: "all 0.15s ease",
              }}
            >
              {tab.label}
            </Button>
          ))}
        </Box>

        {/* Form Body */}
        <Box sx={{ p: 2.5 }}>
          <Formik
            initialValues={{ content: "", image: null, caption: "" }}
            validationSchema={createPostValidation}
            onSubmit={async (values, { setSubmitting, resetForm }) => {
              const formData = new FormData();
              formData.append("caption", values.caption);
              formData.append("content", values.content);
              
              if (values.image) formData.append("image", values.image);

              try {
                await api.post("/api/post/createPost", formData);
                resetForm();
                setPreviewUrl(null);
                setActiveTab("text");
                toast.success("Post Created Succesfully")
                navigate("/") ;
              } catch (err) {
                console.log("Failed to create Post", err);
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleSubmit,
              setFieldValue,
              isSubmitting,
            }) => (
              <form onSubmit={handleSubmit}>
                {/* Caption */}
                <TextField
                  name="caption"
                  label="Title"
                  fullWidth
                  margin="none"
                  value={values.caption}
                  onChange={handleChange}
                  slotProps={{ htmlInput : {maxLength: 150} }}
                  helperText={`${values.caption.length}/150`}
                  formhelpertextprops={{
                    sx: { textAlign: "right", mr: 0, color: "#878a8c" },
                  }}
                  sx={{
                    mb: 2,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 1.5,
                      fontSize: 15,
                      "&:hover fieldset": { borderColor: "#0079d3" },
                      "&.Mui-focused fieldset": { borderColor: "#0079d3" },
                    },
                    "& label.Mui-focused": { color: "#0079d3" },
                  }}
                />

                <Divider sx={{ mb: 2, borderColor: "#edeff1" }} />

                {/* Text Tab */}
                {activeTab === "text" && (
                  <TextField
                    name="content"
                    fullWidth
                    multiline
                    minRows={5}
                    placeholder="What are your thoughts?"
                    value={values.content}
                    onChange={handleChange}
                    error={touched.content && Boolean(errors.content)}
                    helperText={touched.content && errors.content}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 1.5,
                        fontSize: 14,
                        alignItems: "flex-start",
                        "&:hover fieldset": { borderColor: "#0079d3" },
                        "&.Mui-focused fieldset": { borderColor: "#0079d3" },
                      },
                    }}
                  />
                )}

                {/* Image Tab */}
                {activeTab === "image" && (
                  <Box>
                    {!previewUrl ? (
                      <Button
                        component="label"
                        variant="outlined"
                        sx={{
                          width: "100%",
                          height: 160,
                          borderStyle: "dashed",
                          borderColor: "#edeff1",
                          borderRadius: 1.5,
                          flexDirection: "column",
                          gap: 1,
                          color: "#878a8c",
                          bgcolor: "#f6f7f8",
                          "&:hover": {
                            borderColor: "#0079d3",
                            bgcolor: "#eaf3fc",
                            color: "#0079d3",
                          },
                          transition: "all 0.15s ease",
                        }}
                      >
                        <CloudUploadIcon sx={{ fontSize: 36 }} />
                        <Typography variant="body2" fontWeight={500}>
                          Drag & drop or click to upload
                        </Typography>
                        <Typography variant="caption" sx={{ opacity: 0.7 }}>
                          PNG, JPG, GIF up to 10MB
                        </Typography>
                        <input
                          type="file"
                          hidden
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.currentTarget.files[0];
                            if (file) {
                              setFieldValue("image", file);
                              setPreviewUrl(URL.createObjectURL(file));
                            }
                          }}
                        />
                      </Button>
                    ) : (
                      <Box
                        sx={{
                          position: "relative",
                          borderRadius: 1.5,
                          overflow: "hidden",
                          border: "1px solid #edeff1",
                        }}
                      >
                        <img
                          src={previewUrl}
                          alt="Preview"
                          style={{
                            width: "100%",
                            maxHeight: 280,
                            objectFit: "contain",
                            display: "block",
                            background: "#f6f7f8",
                          }}
                        />
                        <IconButton
                          onClick={() => {
                            setFieldValue("image", null);
                            setPreviewUrl(null);
                          }}
                          size="small"
                          sx={{
                            position: "absolute",
                            top: 8,
                            right: 8,
                            bgcolor: "rgba(0,0,0,0.55)",
                            color: "#fff",
                            "&:hover": { bgcolor: "rgba(0,0,0,0.75)" },
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    )}
                    {touched.image && errors.image && (
                      <Typography
                        color="error"
                        variant="caption"
                        sx={{ display: "block", mt: 0.5, ml: 0.5 }}
                      >
                        {errors.image}
                      </Typography>
                    )}
                  </Box>
                )}

                {/* Footer */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    mt: 2.5,
                    pt: 2,
                    borderTop: "1px solid #edeff1",
                    gap : 3
                  }}
                >
                <Button
                    variant="contained"
                    onClick={()=> navigate("/")}
                    sx={{
                      px: 3.5,
                      py: 0.9,
                      bgcolor: "gray",
                      borderRadius: 99,
                      fontWeight: 700,
                      fontSize: 14,
                      textTransform: "none",
                      boxShadow: "none",
                      "&:hover": {
                        bgcolor: "red",
                        boxShadow: "none",
                      },
                      "&:disabled": {
                        bgcolor: "#ffcab8",
                        color: "#fff",
                      },
                    }}
                  >
                  Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={isSubmitting}
                    sx={{
                      px: 3.5,
                      py: 0.9,
                      bgcolor: "#FF4500",
                      borderRadius: 99,
                      fontWeight: 700,
                      fontSize: 14,
                      textTransform: "none",
                      boxShadow: "none",
                      "&:hover": {
                        bgcolor: "#e03d00",
                        boxShadow: "none",
                      },
                      "&:disabled": {
                        bgcolor: "#ffcab8",
                        color: "#fff",
                      },
                    }}
                  >
                    {isSubmitting ? "Posting…" : "Post"}
                  </Button>
                </Box>
              </form>
            )}
          </Formik>
        </Box>
      </Box>
    </Box>
  );
}