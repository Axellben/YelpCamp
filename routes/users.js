const User = require("../models/user");
const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const passport = require("passport");
const users = require("../controllers/users");

router
  .route("/register")
  // Route to handle the registration form
  .get(users.renderRegisterForm)
  // Route to create a new user
  .post(catchAsync(users.createUser));

router
  .route("/login")
  // Route to handle the login form
  .get(users.renderLoginForm)
  // Route to log in a user
  .post(
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login",
    }),
    users.loginUser
  );

// Route to log out a user
router.get("/logout", users.logoutUser);

module.exports = router;
