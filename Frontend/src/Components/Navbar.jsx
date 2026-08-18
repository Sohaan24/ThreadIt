import { useContext} from "react";
import { AppBar, Avatar, Box, TextField } from "@mui/material";
import logo from "../assets/logo4.png";
import AuthForm from "./AuthForm";
import { MyContext } from "./MyContext";
import { useNavigate } from "react-router-dom";
import useHelper from "../utils/useHelper";

export default function Navbar() {
  const navigate = useNavigate();
  const { user, query, setQuery } = useContext(MyContext);
  
  const {stringToColor} = useHelper() ;
  
  const username = user?.username || "Unknown";
  return (
    <>
      <AppBar
        position="sticky"
        sx={{
          bgcolor: "#FFFFFF",
          color: "black",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          padding: "10px 20px",
          alignItems: "center",
          border: "0 0 2px 0 solid #EDEFF1",
        }}
      >
        <Box onClick={() => navigate("/")} sx={{ cursor: "pointer" }}>
          <img
            src={logo}
            alt="reddit logo"
            style={{ width: "120px", height: "70px" }}
          ></img>
        </Box>
        <TextField
          placeholder="Search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          sx={{
            borderColor: "gray",
            borderRadius: 5,
            width: "33rem",
            "& .MuiOutlinedInput-root": {
              borderRadius: 5,

              "& fieldset": {
                borderColor: "gray",
              },

              "&:hover fieldset": {
                borderColor: "#FF4500",
              },

              "&.Mui-focused fieldset": {
                borderColor: "#FF4500",
              },
            },
          }}
        ></TextField>

        {user ? (
          <Avatar
            sx={{
              bgcolor: stringToColor(username),
              width: "35px",
              height: "35px",
            }}
          >
            {" "}
            {username.charAt(0).toUpperCase()}
          </Avatar>
        ) : (
          <AuthForm />
        )}
      </AppBar>
    </>
  );
}
