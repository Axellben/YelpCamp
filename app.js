const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const CampGround = require("./models/campground");

mongoose
  .connect("mongodb://localhost:27017/YelpCamp", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("We're connected to MongoDB");
  })
  .catch((err) => {
    console.err(err);
  });

const app = express();

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.get("/", (req, res) => {
  res.render("home");
});

function wrapAsync(fn) {
  return function (req, res, next) {
    fn(req, res, next).catch((e) => {
      next(e);
    });
  };
}

app.get(
  "/campgrounds",
  wrapAsync(async (req, res, next) => {
    const campgrounds = await CampGround.find({});
    res.render("campgrounds/index", { campgrounds });
  })
);

app.get("/campgrounds/new", (req, res) => {
  res.render("campgrounds/new");
});

app.get("/campgrounds/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const campground = await CampGround.findById(id);
    res.render("campgrounds/show", { campground });
  } catch (e) {
    next(e);
  }
});

app.get("/campgrounds/:id/edit", async (req, res, next) => {
  try {
    const { id } = req.params;
    const campground = await CampGround.findById(id);
    res.render("campgrounds/edit", { campground });
  } catch (e) {
    next(e);
  }
});

app.post("/campgrounds/", async (req, res, next) => {
  try {
    const campground = new CampGround(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
  } catch (e) {
    next(e);
  }
});

app.post("/campgrounds/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const campground = await CampGround.findById(id);
    res.render("campgrounds/edit", { campground });
  } catch (e) {
    next(e);
  }
});

app.put("/campgrounds/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const campground = await CampGround.findByIdAndUpdate(id, {
      ...req.body.campground,
    });
    res.redirect(`/campgrounds/${campground._id}`);
  } catch (e) {
    next(e);
  }
});

app.delete("/campgrounds/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    await CampGround.findByIdAndDelete(id);
    res.redirect(`/campgrounds`);
  } catch (e) {
    next(e);
  }
});

// Set an 404 route
app.use((req, res) => {
  res.status(404).render("404");
});

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
