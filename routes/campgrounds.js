const express = require("express");
const router = express.Router();
const campgrounds = require("../controllers/campgrounds");
const catchAsync = require("../utils/catchAsync");
const { isLoggedIn, isAuthor, validateCampground } = require("../middleware");
const multer = require("multer");
const { storage } = require("../cloudinary/index");
const upload = multer({ storage });

router
  .route("/")
  // Route to show all campgrounds
  .get(catchAsync(campgrounds.index))
  // Route to handle the POST request to create a new campground
  .post(
    isLoggedIn,
    upload.array("image"),
    validateCampground,
    catchAsync(campgrounds.createCampground)
  );

// Route to get the form to create a new campground
router.get("/new", isLoggedIn, campgrounds.renderNewForm);

router
  .route("/:id")
  // Route to get a campground by id
  .get(catchAsync(campgrounds.showCampground))
  // Route to handle the PUT request to update a campground
  .put(
    isAuthor,
    upload.array("image"),
    validateCampground,
    catchAsync(campgrounds.updateCampground)
  )
  // Route to handle the DELETE request to delete a campground
  .delete(isAuthor, catchAsync(campgrounds.deleteCampground));

// Route to get the form to edit a campground
router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(campgrounds.renderEditForm)
);

module.exports = router;
