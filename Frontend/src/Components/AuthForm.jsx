import { useState, useContext } from "react";
import { MyContext } from "./MyContext";
import {
  Backdrop,
  Modal,
  Fade,
  Button,
  Typography,
  TextField,
  Stack,
} from "@mui/material";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function AuthForm() {
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 500,
    bgcolor: "background.paper",
    border: "2px solid gray",
    boxShadow: 3,
    p: 4,
    borderRadius: 2,
  };
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const { handleAuthentication, isLoading, error, setError } =
    useContext(MyContext);
  const [isLogged, setIsLogged] = useState(false);

  const signupSchema = Yup.object({
    username: Yup.string()
      .required("Username is required")
      .min(5, "Username must be at least 5 characters long"),
    email: Yup.string()
      .required("Email is required")
      .email("Invalid email address"),
    password: Yup.string()
      .required("Password is required")
      .min(7, "Password must contain at least 7 characters"),
  });

  const loginSchema = Yup.object({
    email: Yup.string()
      .required("Email is required")
      .email("Invalid email address"),
    password: Yup.string().required("Password is required"),
  });

  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
    },
    validationSchema: isLogged ? loginSchema : signupSchema,
    enableReinitialize: true,

    onSubmit: async (values) => {
      const payload = {
        email : values.email,
        password : values.password,
      } ;

      if(!isLogged) {
        payload.username = values.username 
      }

      try {
        
        const isSuccess = await handleAuthentication(payload, isLogged);
        
        if (isSuccess && isLogged) {
          toast.success("Welcome user");
          
          setOpen(false);
          setError(null);
        }

        if(isSuccess && !isLogged) {
          formik.resetForm();
          setError(null);
          setIsLogged(true) ;
        }
      } catch (e) {
        console.log("AuthForm Error : ", e);
      }
    },
  });

  return (
    <>
      <div>
        <Button
          onClick={handleOpen}
          sx={{ bgcolor: "#FF4500", color: "#FFFFFF" }}
        >
          Sign up
        </Button>
        <Modal
          open={open}
          onClose={handleClose}
          closeAfterTransition
          slots={{ backdrop: Backdrop }}
          slotProps={{
            backdrop: {
              timeout: 500,
            },
          }}
        >
          <Fade in={open}>
            <Stack sx={style} component="form" onSubmit={formik.handleSubmit}>
              {error && (
                <Typography color="error" sx={{ mb: 2, textAlign: "center" }}>
                  {error}
                </Typography>
              )}
              {!isLogged ? (
                <>
                  <Typography
                    variant="h3"
                    sx={{ mb: 2, mx: "auto", color: "#1C1C1C" }}
                  >
                    Sign Up
                  </Typography>
                  <TextField
                    name="username"
                    id="outlined-Username-input"
                    label="Username"
                    margin="normal"
                    value={formik.values.username}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.username && Boolean(formik.errors.username)
                    }
                    helperText={
                      formik.touched.username && formik.errors.username
                    }
                  />
                  <TextField
                    name="email"
                    id="outlined-Email-input"
                    label="Email"
                    margin="normal"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}
                  />
                  <TextField
                    name="password"
                    id="outlined-password-input"
                    label="Password"
                    type="password"
                    autoComplete="current-password"
                    margin="normal"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.password && Boolean(formik.errors.password)
                    }
                    helperText={
                      formik.touched.password && formik.errors.password
                    }
                  />

                  <Button
                    variant="contained"
                    size="large"
                    type = "submit"
                    sx={{ mt: 3, mb: 2, bgcolor: "#FF4500" }}
                  >
                    {isLoading ? "Loading..." : "Sign Up"}
                  </Button>
                  <Typography
                    variant="body2"
                    onClick={() => {
                      setIsLogged(true);
                      formik.resetForm();
                    }}
                    sx={{
                      "&:hover": { color: "#FF4500", cursor: "pointer" },
                      mx: "auto",
                    }}
                  >
                    Already Logged In ?
                  </Typography>
                </>
              ) : (
                <>
                  <Typography
                    variant="h3"
                    sx={{ mb: 2, mx: "auto", color: "#1C1C1C" }}
                  >
                    Welcome Back !
                  </Typography>
                  <TextField
                    name="email"
                    id="outlined-Email-input"
                    label="Email"
                    margin="normal"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}
                  />
                  <TextField
                    name="password"
                    id="outlined-password-input"
                    label="Password"
                    type="password"
                    autoComplete="current-password"
                    margin="normal"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.password && Boolean(formik.errors.password)
                    }
                    helperText={formik.touched.email && formik.errors.email}
                  />

                  <Button
                    variant="contained"
                    size="large"
                    type="submit"
                    sx={{ mt: 3, mb: 2, bgcolor: "#FF4500" }}
                  >
                    {isLoading ? "Loading..." : "Login"}
                  </Button>
                  <Typography
                    variant="body2"
                    onClick={() => {
                      formik.resetForm();
                      setIsLogged(false);
                    }}
                    sx={{
                      "&:hover": { color: "#FF4500", cursor: "pointer" },
                      mx: "auto",
                    }}
                  >
                    Create a New Account
                  </Typography>
                </>
              )}
            </Stack>
          </Fade>
        </Modal>
      </div>
    </>
  );
}
