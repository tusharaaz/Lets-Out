const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");

router.get("/signup", (req, res) => {
  res.render("users/signup.ejs");
});

router.post(
  "/signup",
  wrapAsync(async (req, res) => {
    const { username, email, password } = req.body;
    const user = new User({ username, email });
    const registeruser = await User.register(user, password);
    req.flash("success", "Welcome to Lets Out, " + username);
    console.log(registeruser);
    res.redirect("/listings");
  })
);

router.get("/login", (req, res) => {
  res.render("users/login.ejs");
});


router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  async (req, res) => {
    req.flash("success", "Welcome back to Lets Out, " + req.body.username);

    res.redirect("/listings");
  }
);

module.exports = router;
