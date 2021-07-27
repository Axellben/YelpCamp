const Review = require("../models/review");
const CampGround = require("../models/campground");

module.exports.createReview = async (req, res, next) => {
  const { id } = req.params;
  const campground = await CampGround.findById(id);
  const review = new Review(req.body.review);
  review.author = req.user._id;
  campground.reviews.push(review);
  await review.save();
  await campground.save();
  req.flash("success", "Review successfully created.");
  res.redirect(`/campgrounds/${id}`);
};

module.exports.deleteReview = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const campground = await CampGround.findById(id);
  const review = await Review.findById(reviewId);
  campground.reviews.pull(review);
  await review.remove();
  await campground.save();
  req.flash("success", "Review successfully deleted.");
  res.redirect(`/campgrounds/${id}`);
};
