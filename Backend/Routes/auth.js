const express = require("express") ;
const router = express.Router() ;
const wrapAsync = require("../Utils/wrapAsync") ;
const authController = require("../Controllers/authController")

router.post("/signup", wrapAsync (authController.signup));
router.post("/login",wrapAsync (authController.login));

router.post("/logout", authController.logout);

module.exports = router ;