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
import {toast} from "react-toastify" ;

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
  const { handleAuthentication, isLoading, error,setError} = useContext(MyContext) ; 
  const [isLogged, setIsLogged] = useState(false);

  const [formData , setFormData] = useState({
    username : "",
    email : "",
    password : "",
  })

  const handleInput = (e)=> {
    setFormData({
        ...formData,
        [e.target.name] : e.target.value
    });
  }

  const handleSubmit = async (e)=> {
  
    e.preventDefault() ;
    const isSuccess = await handleAuthentication(formData, isLogged) ;
    
    if(isSuccess) {
      toast.success(`Welcome User`) ;
    }
    setFormData({username : "", email : "", password :""}) ;
    
    if(isSuccess) {
      setOpen(false) ;
      setError(null) ;
    }

  }
  return (
    <>
      <div>
        <Button onClick={handleOpen} sx={{bgcolor : "#FF4500", color : "#FFFFFF"}}>Sign up</Button>
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
          
            <Stack sx={style}>
            {error && <Typography color="error" sx={{mb : 2, textAlign : "center"}}>{error}</Typography>}
              {!isLogged ? (
                <>
                  <Typography variant="h3" sx={{ mb: 2, mx: "auto", color : "#1C1C1C" }}>
                    Sign Up
                  </Typography>
                  <TextField
                    name = "username"
                    id="outlined-Username-input"
                    label="Username"
                    margin="normal"
                    value= {formData.username}
                    onChange={handleInput}
                    
                  />
                  <TextField
                    name="email"
                    id="outlined-Email-input"
                    label="Email"
                    margin="normal"
                    value={formData.email}
                    onChange={handleInput}
                  />
                  <TextField
                  name="password"
                    id="outlined-password-input"
                    label="Password"
                    type="password"
                    autoComplete="current-password"
                    margin="normal"
                    value={formData.password}
                    onChange={handleInput}
                  />

                  <Button variant="contained" size="large" onClick = {handleSubmit}sx={{ mt: 3, mb: 2, bgcolor : "#FF4500" }}>{isLoading ? "Loading..." : "Sign Up"}</Button>
                  <Typography
                    variant="body2" onClick= {()=> setIsLogged(true)}
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
                  <Typography variant="h3" sx={{ mb: 2, mx: "auto" ,color : "#1C1C1C" }}>
                    Welcome Back !
                  </Typography>
                  <TextField
                    name = "email"
                    id="outlined-Email-input"
                    label="Email"
                    margin="normal"
                    value={formData.email}
                    onChange={handleInput}
                  />
                  <TextField
                    name = "password"
                    id="outlined-password-input"
                    label="Password"
                    type="password"
                    autoComplete="current-password"
                    margin="normal"
                    value={formData.password}
                    onChange={handleInput}
                  />

                  <Button variant="contained" size="large" onClick={handleSubmit} sx={{ mt: 3, mb: 2, bgcolor : "#FF4500"}}>{isLoading ? "Loading..." : "Login"}</Button>
                  <Typography
                    variant="body2"
                    onClick= {()=> setIsLogged(false)}
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
