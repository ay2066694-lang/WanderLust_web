const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

const { signUp, signUpForm, loginForm, logIn, logOut } = require("../controllers/user.js");

router.route("/signup")
.get(signUpForm)
.post(wrapAsync(signUp));

router.route("/login")
.get(loginForm)
.post(saveRedirectUrl, passport.authenticate("local", {failureRedirect: "/login", failureFlash: true}), logIn);


//logout route
router.get("/logout", logOut);

module.exports = router;