const express = require("express");
const router = express.Router();
const requireAuth = require("../Middleware/requireAuth") ;
const wrapAsync = require("../Utils/wrapAsync");
const upload = require("../Middleware/uploads") ;
const postController = require("../Controllers/postController") ;


router.post("/createPost",requireAuth, upload.single("image"), wrapAsync (postController.createPost));
router.get("/all", wrapAsync(postController.all)) ;
router.get("/getPost/:postId", wrapAsync(postController.getPost));
router.put("/update/:postId",requireAuth, upload.single("image"),wrapAsync (postController.editPost));
router.patch("/vote/:postId",requireAuth, wrapAsync (postController.vote));
router.delete("/delete/:postId", requireAuth, wrapAsync (postController.deletePost));

module.exports = router ;
