import { Box, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import {useNavigate} from  "react-router-dom" ;
export default function Sidebar() {
  const navigate = useNavigate() ;
  return (
    <>
      <Box sx={{ 

        color: "black",
        bgcolor : "#FFFFFF",
        width : {xs : "0px",md : "250px"},
        display : {xs: "none", md : "block"},
        borderRight : "1px solid lightgray",
        height : "100%",
        p : 2 
         }}>
          
          <Button sx={{bgcolor : "#1A1A1B", color : "white", mt : 2}} disableRipple onClick={()=> navigate("/create-post")}><AddIcon/> Create Post</Button>
        </Box>
    </>
  );
}
