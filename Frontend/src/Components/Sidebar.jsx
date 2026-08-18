import { Box,Button} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import {useNavigate} from  "react-router-dom" ;
import {useContext} from "react" ;
import {MyContext} from "./MyContext" ;
import { LogOut } from 'lucide-react';

export default function Sidebar() {
  const navigate = useNavigate() ;
  const {user, handleLogout} = useContext(MyContext) ;


  return (
  <>
    <Box
      sx={{
        color: "black",
        bgcolor: "#FFFFFF",
        width: { xs: "0px", md: "250px" },
        display: { xs: "none", md: "block" },
        borderRight: "1px solid #EDEFF1",
        height: "100%",
        p: 2,
      }}
    >
      <Button
        fullWidth
        disableRipple
        onClick={() => navigate("/create-post")}
        startIcon={<AddIcon />}
        sx={{
          bgcolor: "#FF4500",
          color: "#FFFFFF",
          textTransform: "none",
          fontFamily: "'Inter', sans-serif",
          fontWeight: 600,
          fontSize: "0.88rem",
          borderRadius: 5,
          py: 0.9,
          mt :2,
          "&:hover": { bgcolor: "#D33600" },
        }}
      >
        Create
      </Button>

      {user && (
        <Button
          fullWidth
          disableRipple
          onClick={handleLogout}
          startIcon={<LogOut size={16} />}
          sx={{
            bgcolor: "#1A1A1B",
            color: "#F3F4F6", 
            textTransform: "none",
            fontFamily: "'Inter', sans-serif",
            fontWeight: 700,
            fontSize: "0.88rem",
            border: "1px solid #EDEFF1",
            borderRadius: 5,
            py: 0.9,
            mt: 1.25,
            "&:hover": { bgcolor: "#F6F7F8", borderColor: "#D3D6DA",color : "#1A1A1B" },
          }}
        >
          Log Out
        </Button>
      )}
    </Box>
  </>
);
}
