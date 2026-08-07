import {useState, useEffect, useContext} from "react";

import { useFormik} from "formik";
import { useNavigate, useParams } from "react-router-dom";

import {
  Box,
  TextField,
  IconButton,
  Button,
  Avatar,
  Divider,
  Typography
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import * as Yup from "yup";
import api from "./axiosConfig";
import {MyContext} from "./MyContext";
import {toast} from "react-toastify" ;

export default function EditPost() {

   const {postId} = useParams() ;
   const navigate = useNavigate() ;

   const[post, setPost] = useState(null) ;

   useEffect(()=> {
    const fetchPost = async()=> {
        try {
            const response = await api.get(`/api/post/getPost/${postId}`) ;
            setPost(response.data.post) ;
        }catch(err) {
            console.log("failed in edit post :", err) ;
        }
    }
    fetchPost() ;
   },[postId]) ;

   const {user} = useContext(MyContext) ;

    const EditValidation = Yup.object().shape({
        Title : Yup.string().required("Title is required"),

        image : Yup.mixed().nullable().when("content", {
            is : (content)=>content && content.trim() !== "" ,
            then : (schema)=>
                schema.test("is-empty", "Provide content or Image not both", (value)=> value === null || value === undefined || value === ""
            ),
            otherwise : (schema)=>
                schema.required("Please provide content or image")
        }),

        content : Yup.string().when("image", {
            is : (image)=> image !== null && image != undefined && image !== "" ,
            then : (schema)=>
                schema.test("is-empty", "Please provide image or content not both", (value)=> value === null || value === undefined),
            otherwise : (schema)=> schema.required("please provide content or image")
        })
    },[["image", "content"]]);

    const formik = useFormik({
        initialValues : {
            Title : post?.caption || "",
            image : post?.imageUrl || "" ,
            content : post?.content || ""
        },
        validationSchema : EditValidation,
        enableReinitialize : true ,
        onSubmit : async(values, {setSubmitting})=> {
          const formData =  new FormData() ;

          formData.append("caption", values.Title)
          formData.append("content" ,values.content)

          if (values.image instanceof File) {
           
            formData.append("image", values.image);
          }else if (values.image === null) {
       
            formData.append("removeImage", "true");
          }

          try {
            await api.put(`/api/post/update/${postId}`, formData) ;
            toast.success("Post Edited") ;
            navigate("/") ;
            
          }catch(err) {
            console.log("error occured in edit Form", err) ;

          }finally{
            setSubmitting(false) ;
          }
        }

        
    })

    const isNewFile = formik.values.image instanceof File ;
    const preview = isNewFile ? URL.createObjectURL(formik.values.image) : (formik.values.image === null ? "" : formik.values.image)|| "" ;

    useEffect(()=> {
        if(!isNewFile) return ;
        const url = preview ;
        return()=> URL.revokeObjectURL(url) ;
    },[preview, isNewFile])

    if (!post) {
        return <Box>Loading post data...</Box>;
    }

    return (
        <Box sx={{ width : {xs : "100%", sm : 500}, mx : "auto", mt : 4, mb : 4, px : {xs : 2, sm : 0}}}>

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
                p: 2.5,
              }}
            >
              <form onSubmit={formik.handleSubmit}>
                <Box>
                    <TextField
                    name = "Title"
                    label = "Caption"
                    fullWidth
                    onChange={formik.handleChange}
                    onBlur = {formik.handleBlur}
                    value = {formik.values.Title}
                    slotProps={{htmlInput : {maxLength : 150}}}
                    error = {formik.touched.Title && Boolean(formik.errors.Title)}
                    helperText = {`${formik.values.Title.length}/150`}
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
                </Box>

                <Divider sx={{ mb: 2, borderColor: "#edeff1" }} />

                <Box>
                    <TextField
                    name = "content"
                    label = "Content"
                    fullWidth
                    multiline
                    minRows={5}
                    onChange = {formik.handleChange}
                    onBlur = {formik.handleBlur}
                    value = {formik.values.content}
                    error = {formik.touched.content && Boolean(formik.errors.content)}
                    helperText = {formik.touched.content && formik.errors.content}
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
                </Box>

                <Box sx={{ mt: 2 }}>
                        {!preview ? (
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
                                type = "file"
                                hidden
                                accept = "image/*"
                                onChange = {(e)=> {
                                    formik.setFieldValue("image",e.currentTarget.files[0]) ;
                                }}
                                onBlur={formik.handleBlur}
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
                              src={preview}
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
                                formik.setFieldValue("image", null);
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
                              disableRipple
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        )}
                        {formik.touched.image && formik.errors.image && (
                          <Typography
                            color="error"
                            variant="caption"
                            sx={{ display: "block", mt: 0.5, ml: 0.5 }}
                          >
                            {formik.errors.image}
                          </Typography>
                        )}
                </Box>

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
                    disabled={formik.isSubmitting}
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
                    {formik.isSubmitting ? "Editing" : "Edit"}
                  </Button>
                </Box>
              </form>
            </Box>
        </Box>
    )
}