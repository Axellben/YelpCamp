const User = require("../models/user");

module.exports.renderRegisterForm = (req, res) => {
  res.render("users/register");
};

module.exports.createUser = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const user = new User({ username, email });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, (errr) => {
      if (errr) {
        next(errr);
      }
    });
    req.flash("success", "Registration successful!");
    res.redirect("/campgrounds");
  } catch (err) {
    req.flash("error", err.message);
    return res.redirect("/register");
  }
};

module.exports.renderLoginForm = (req, res) => {
  res.render("users/login");
};

module.exports.loginUser = (req, res) => {
  req.flash("success", "Login successful!");
  const redirect = req.session.returnTo || "/campgrounds";
  delete req.session.returnTo;
  res.redirect(redirect);
};

module.exports.logoutUser = (req, res) => {
  req.logout();
  req.flash("success", "Logout successful!");
  res.redirect("/login");
};
