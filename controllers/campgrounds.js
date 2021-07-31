const CampGround = require("../models/campground");
const { cloudinary } = require("../cloudinary/index");

module.exports.index = async (req, res, next) => {
  const campgrounds = await CampGround.find({});
  res.render("campgrounds/index", { campgrounds });
};

module.exports.renderNewForm = (req, res) => {
  res.render("campgrounds/new");
};

module.exports.showCampground = async (req, res, next) => {
  const { id } = req.params;
  const campground = await await CampGround.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("author");
  if (!campground) {
    req.flash("error", "Campground not found");
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/show", { campground });
};

module.exports.renderEditForm = async (req, res, next) => {
  const { id } = req.params;
  const campground = await CampGround.findById(id);
  if (!campground) {
    req.flash("error", "Campground not found");
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/edit", { campground });
};

module.exports.updateCampground = async (req, res, next) => {
  const { id } = req.params;
  const updatedCampground = await CampGround.findByIdAndUpdate(
    id,
    {
      ...req.body.campground,
    },
    { useFindAndModify: false }
  );
  // Save image details to the campground
  req.files.forEach((file) => {
    updatedCampground.images.push({ url: file.path, filename: file.filename });
  });
  await updatedCampground.save();
  // Deletes images that are in the request
  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    await updatedCampground.updateOne({
      $pull: { images: { filename: { $in: req.body.deleteImages } } },
    });
  }
  req.flash("success", "Campground updated!");
  res.redirect(`/campgrounds/${updatedCampground._id}`);
};

module.exports.createCampground = async (req, res, next) => {
  const campground = new CampGround(req.body.campground);
  campground.author = req.user._id;

  // Save image details to the campground
  req.files.forEach((file) => {
    campground.images.push({ url: file.path, filename: file.filename });
  });

  await campground.save();
  req.flash("success", "Campground created!");
  res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.deleteCampground = async (req, res, next) => {
  const { id } = req.params;
  const campground = await CampGround.findByIdAndDelete(id);
  for (let image of campground.images) {
    await cloudinary.uploader.destroy(image.filename);
  }
  req.flash("success", "Campground deleted!");
  res.redirect(`/campgrounds`);
};
