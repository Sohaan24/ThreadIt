import {useContext} from "react" ;
import {AppBar, Avatar} from "@mui/material" ;
import logo from "../assets/logo2.png" ;
import AuthForm from "./AuthForm";
import { MyContext } from "./MyContext";

export default function Navbar() {
    const {user} = useContext(MyContext) ;
    function stringToColor(string) {
    let hash = 0;
    let i;
    

    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = "#";

    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }

    return color;
  }
  const username = user?.username || "Unknown";
    return (
        <>
            <AppBar position="sticky" sx={{bgcolor :"#FFFFFF" ,color : "black" , display : "flex", flexDirection : "row", justifyContent : "space-between" ,padding : "10px 20px", alignItems : "center", border : "0 0 2px 0 solid #EDEFF1"}}>
                <img src= {logo} alt="reddit logo" style = {{width : "120px", height : "70px"}}></img>
                {user ? (<Avatar sx={{bgcolor : stringToColor(username), width : "35px", height : "35px"}}> {username.charAt(0).toUpperCase()}</Avatar>) : <AuthForm/>}

            </AppBar>
        </>
    );
}