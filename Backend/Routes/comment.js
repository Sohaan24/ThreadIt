const express = require("express") ;
const router = express.Router() ;
const requireAuth = require("../Middleware/requireAuth") ;
const wrapAsync = require("../Utils/wrapAsync") ;
const commentController = require("../Controllers/commentController")

router.post("/createThread", requireAuth,wrapAsync (commentController.createThread));
router.get("/getThread/:postId",wrapAsync (commentController.getThread));
router.patch("/vote/:commentId",requireAuth, wrapAsync (commentController.vote));
router.patch("/updateThread/:commentId",requireAuth, wrapAsync (commentController.editThread));
router.patch("/deleteThread/:commentId",requireAuth, wrapAsync (commentController.deleteThread));


module.exports = router ;

