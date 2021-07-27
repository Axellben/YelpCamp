const { campgroundSchema, reviewSchema } = require("./schemas");
const ExpressError = require("./utils/ExpressError");
const CampGround = require("./models/campground");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash("error", "You must be logged in first.");
    return res.redirect("/login");
  }
  next();
};

module.exports.validateCampground = (req, res, next) => {
  const result = campgroundSchema.validate(req.body);
  if (result.error) {
    throw new ExpressError(result.error, 400);
  } else {
    next();
  }
};

module.exports.isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const campground = await CampGround.findById(id);

  if (!campground.author.equals(req.user._id)) {
    req.flash("error", "You are not authorized to do this.");
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
};

module.exports.validateReview = (req, res, next) => {
  const result = reviewSchema.validate(req.body);
  if (result.error) {
    throw new ExpressError(result.error, 400);
  } else {
    next();
  }
};
