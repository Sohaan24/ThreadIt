const express = require("express") ;
const postRoutes = require("./Routes/post") ;
const cookieParser = require("cookie-parser");
const authRoutes = require("./Routes/auth") ;
const commentRoutes = require("./Routes/comment") ;

const app = express();
app.use(express.json()) ;
app.use(cookieParser()) ;

app.use("/api/auth", authRoutes);
app.use("/api/post", postRoutes);
app.use("/api/comment", commentRoutes);


export default app;