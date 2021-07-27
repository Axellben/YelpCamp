const express = require("express");
const router = express.Router({ mergeParams: true });

const catchAsync = require("../utils/catchAsync");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware");

const reviews = require("../controllers/reviews");

// Route to create a new review
router.post("/", isLoggedIn, validateReview, catchAsync(reviews.createReview));

// Route to delete a review
router.delete("/:reviewId", isReviewAuthor, catchAsync(reviews.deleteReview));

module.exports = router;
