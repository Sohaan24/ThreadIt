import { Box, CssBaseline } from "@mui/material";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import {Outlet} from "react-router-dom" ;


export default function MainLayout() {
  
  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh", mb: 2, bgcolor: "#DAE0E6" }}>
      <CssBaseline />
      <Navbar />
      <Box sx={{ display: "flex",flexShrink: 1, overflow: "hidden" }}>
        <Sidebar />
        <Box sx={{ flexGrow: 1, overflowY: "auto", minWidth : 0 }}>
            <Outlet/>
        </Box>
      </Box>
      
    </Box>
  );
}
