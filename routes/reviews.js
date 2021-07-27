const express = require("express");
const router = express.Router({ mergeParams: true });

const Review = require("../models/review");
const CampGround = require("../models/campground");

const catchAsync = require("../utils/catchAsync");
const { validateReview } = require("../middleware");

router.post(
  "/",
  validateReview,
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const campground = await CampGround.findById(id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash("success", "Review successfully created.");
    res.redirect(`/campgrounds/${id}`);
  })
);

router.delete(
  "/:reviewId",
  catchAsync(async (req, res, next) => {
    const { id, reviewId } = req.params;
    const campground = await CampGround.findById(id);
    const review = await Review.findById(reviewId);
    campground.reviews.pull(review);
    await review.remove();
    await campground.save();
    req.flash("success", "Review successfully deleted.");
    res.redirect(`/campgrounds/${id}`);
  })
);

module.exports = router;
