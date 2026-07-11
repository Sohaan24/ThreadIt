require("dotenv").config()  ;
const express = require("express") ;
const app = express() ;
const mongoose = require("mongoose") ;
const cors = require("cors") ;
const PORT = 3000 ;
const dbURL = process.env.MONGO_URL ;
const cookieParser = require("cookie-parser");

const authRoutes = require("./Routes/auth.js") ;
const commentRoutes = require("./Routes/comment.js") ;
const postRoutes = require("./Routes/post.js") ;

app.use(cors({
  origin : "http://localhost:5173",
  credentials: true
})) ;

app.use(express.json()) ;
app.use(cookieParser()) ;

app.use("/api/auth", authRoutes);
app.use("/api/post", postRoutes);
app.use("/api/comment", commentRoutes);


app.use((err, req, res, next) => {
    console.error(err.stack); 
    
    const statusCode = err.statusCode || 500;
    const message = err.message || "Something went wrong on the server";

    res.status(statusCode).json({ error: message });
});

async function main() {
  try {
    await mongoose.connect(dbURL); 
    console.log("Connected to MongoDB Atlas successfully");

    
    app.listen(PORT, () => {
      console.log(`Server is running on ${PORT}`);
    });
    

  } catch (err) {
    console.error("MongoDB Connection Error:", err);
    process.exit(1); 
  }
}

if (require.main === module) {
    main();
}

module.exports = app;

