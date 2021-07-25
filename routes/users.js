const User = require("../models/user");
const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const passport = require("passport");

router.get("/register", (req, res) => {
  res.render("users/register");
});

router.post(
  "/register",
  catchAsync(async (req, res, next) => {
    try {
      const { username, email, password } = req.body;
      const user = new User({ username, email });
      const registeredUser = await User.register(user, password);
      req.login(registeredUser, (errr) => {
        if (errr) {
          next(errr);
        }
      });
      console.log(`Registered user: ${registeredUser}`);
      req.flash("success", "Registration successful!");
      res.redirect("/campgrounds");
    } catch (err) {
      req.flash("error", err.message);
      return res.redirect("/register");
    }
  })
);

router.get("/login", (req, res) => {
  res.render("users/login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  (req, res) => {
    req.flash("success", "Login successful!");
    const redirect = req.session.returnTo || "/campgrounds";
    delete req.session.returnTo;
    res.redirect(redirect);
  }
);

router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success", "Logout successful!");
  res.redirect("/login");
});

module.exports = router;
