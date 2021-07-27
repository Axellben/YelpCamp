const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const CampGround = require("../models/campground");
const { isLoggedIn, isAuthor, validateCampground } = require("../middleware");

router.get(
  "/",
  catchAsync(async (req, res, next) => {
    const campgrounds = await CampGround.find({});
    res.render("campgrounds/index", { campgrounds });
  })
);

router.get("/new", isLoggedIn, (req, res) => {
  res.render("campgrounds/new");
});

router.get(
  "/:id",
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const campground = await await CampGround.findById(id)
      .populate("reviews")
      .populate("author");
    if (!campground) {
      req.flash("error", "Campground not found");
      return res.redirect("/campgrounds");
    }
    res.render("campgrounds/show", { campground });
  })
);

router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const campground = await CampGround.findById(id);
    if (!campground) {
      req.flash("error", "Campground not found");
      return res.redirect("/campgrounds");
    }
    res.render("campgrounds/edit", { campground });
  })
);

// Route to handle the POST request to create a new campground
router.post(
  "/",
  isLoggedIn,
  validateCampground,
  catchAsync(async (req, res, next) => {
    const campground = new CampGround(req.body.campground);
    campground.author = req.user._id;
    await campground.save();
    req.flash("success", "Campground created!");
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

// Route to handle the POST request to edit a campground
router.post(
  "/:id",
  isAuthor,
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const campground = await CampGround.findById(id);
    res.render("campgrounds/edit", { campground });
  })
);

// Route to handle the PUT request to update a campground
router.put(
  "/:id",
  isAuthor,
  validateCampground,
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const campground = await CampGround.findById(id);

    const updatedCampground = await CampGround.findByIdAndUpdate(
      id,
      {
        ...req.body.campground,
      },
      { useFindAndModify: false }
    );
    req.flash("success", "Campground updated!");
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

// Route to handle the DELETE request to delete a campground
router.delete(
  "/:id",
  isAuthor,
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    await CampGround.findByIdAndDelete(id, { useFindAndModify: false });
    req.flash("success", "Campground deleted!");
    res.redirect(`/campgrounds`);
  })
);

module.exports = router;
