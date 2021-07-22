const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const CampGround = require("../models/campground");
const { campgroundSchema } = require("../schemas");

const validateCampground = (req, res, next) => {
  const result = campgroundSchema.validate(req.body);
  if (result.error) {
    throw new ExpressError(result.error, 400);
  } else {
    next();
  }
};

router.get(
  "/",
  catchAsync(async (req, res, next) => {
    const campgrounds = await CampGround.find({});
    res.render("campgrounds/index", { campgrounds });
  })
);

router.get("/new", (req, res) => {
  res.render("campgrounds/new");
});

router.get(
  "/:id",
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const campground = await CampGround.findById(id).populate("reviews");
    if (!campground) {
      req.flash("error", "Campground not found");
      return res.redirect("/campgrounds");
    }
    res.render("campgrounds/show", { campground });
  })
);

router.get(
  "/:id/edit",
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
  validateCampground,
  catchAsync(async (req, res, next) => {
    const campground = new CampGround(req.body.campground);
    await campground.save();
    req.flash("success", "Campground created!");
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

// Route to handle the POST request to edit a campground
router.post(
  "/:id",
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const campground = await CampGround.findById(id);
    res.render("campgrounds/edit", { campground });
  })
);

// Route to handle the PUT request to update a campground
router.put(
  "/:id",
  validateCampground,
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const campground = await CampGround.findByIdAndUpdate(
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
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    await CampGround.findByIdAndDelete(id, { useFindAndModify: false });
    req.flash("success", "Campground deleted!");
    res.redirect(`/campgrounds`);
  })
);

module.exports = router;
