require("dotenv").config()  ;
const express = require("express") ;
const app = express() ;
const mongoose = require("mongoose") ;
const cors = require("cors") ;
const PORT = 3000 ;
const dbURL = process.env.MONGO_URL ;
const cookieParser = require("cookie-parser");
const http = require("http") ;
const {Server} = require("socket.io") ;

const authRoutes = require("./Routes/auth.js") ;
const commentRoutes = require("./Routes/comment.js") ;
const postRoutes = require("./Routes/post.js") ;

app.use(cors({
  origin : "http://localhost:5173",
  credentials: true
})) ;

app.use(express.json()) ;
app.use(express.urlencoded({ extended: true }));
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

const server = http.createServer(app) ;
const io = new Server(server, {
  cors : {
    origin : "http://localhost:5173",
    methods: ["GET", "POST", "PUT","PATCH", "DELETE"]
  }
});

io.on("connection", (socket)=> {
  console.log(`User connected : ${socket.id}`)

  
  socket.on("delete-post", (postId)=> {
    socket.broadcast.emit("post-deleted", postId) ;
  })

  socket.on("post-created",(post)=> {
    socket.broadcast.emit("post-created", post) ;
  }) ;

  socket.on("post-edited",(post)=> {
    socket.broadcast.emit("post-edited", post) ;
  }) ;

  socket.on("updated-vote",(voteData)=> {

    socket.broadcast.emit("updated-vote",voteData ) ;
  })

  socket.on("join the room", (postId)=> {
    socket.join(postId) ;
    console.log(`user ${socket.id} joind the room of post : ${postId}`) ;
  }) ;


  socket.on("leave room", (postId)=> {
    socket.leave(postId) ;
    console.log(`user ${socket.id} leaved room of post : ${postId}`) ;
  }) ;

  socket.on("new-comment", (data)=> {
    socket.to(data.postId).emit("comment-added", data.comment) ;
  })

  socket.on("edit-comment",(data)=> {
    socket.to(data.postId).emit("edit-comment", data) ; 
  }) ;

  socket.on("delete-comment", (data)=> {
    socket.to(data.postId).emit("delete-comment", data) ;
  } );

  socket.on("update-commentVote", (data)=> {
    socket.to(data.postId).emit("update-commentVote", data) ;
  })
});

async function main() {
  try {
    await mongoose.connect(dbURL); 
    console.log("Connected to MongoDB Atlas successfully");

    
    server.listen(PORT, () => {
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

