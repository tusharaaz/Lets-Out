const express = require("express");
const router = express.Router();
const users = require("../controllers/users");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");
const wrapAsync = require("../utils/wrapAsync");

// Signup Routes
router.route("/signup")
    .get(users.renderSignupForm)
    .post(wrapAsync(users.signup));

// Login Routes
router.route("/login")
    .get(users.renderLoginForm)
    .post(
        saveRedirectUrl,
        passport.authenticate("local", {
            failureRedirect: "/login",
            failureFlash: true,
        }),
        users.login
    );

// Logout Route
router.get("/logout", users.logout);

module.exports = router;