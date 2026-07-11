import { Box, CssBaseline } from "@mui/material";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";


export default function MainLayout({children}) {
  
  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh", mb: 2, bgcolor: "#DAE0E6" }}>
      <CssBaseline />
      <Navbar />
      <Box sx={{ display: "flex",flexGrow : 1, overflow: "hidden" }}>
        <Sidebar />
        <Box sx={{ flexGrow: 1, overflowY: "auto" }}>
            {children}
        </Box>
      </Box>
      
    </Box>
  );
}
