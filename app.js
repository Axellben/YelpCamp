const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
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

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/campgrounds", async (req, res) => {
  const campgrounds = await CampGround.find({});
  res.render("campgrounds/index", { campgrounds });
});

app.get("/campgrounds/new", (req, res) => {
  res.render("campgrounds/new");
});

app.get("/campgrounds/:id", async (req, res) => {
  const { id } = req.params;
  const campground = await CampGround.findById(id);
  res.render("campgrounds/show", { campground });
});

app.get("/campgrounds/:id/edit", async (req, res) => {
  const { id } = req.params;
  const campground = await CampGround.findById(id);
  res.render("campgrounds/edit", { campground });
});

app.post("/campgrounds/", async (req, res) => {
  const { title, location } = req.body.campground;
  const campground = new CampGround({ title, location });
  await campground.save();
  res.redirect(`/campgrounds/${campground._id}`);
});

app.post("/campgrounds/:id", async (req, res) => {
  const { id } = req.params;
  const campground = await CampGround.findById(id);
  res.render("campgrounds/edit", { campground });
});

app.put("/campgrounds/:id", async (req, res) => {
  const { id } = req.params;
  const campground = await CampGround.findByIdAndUpdate(id, {
    ...req.body.campground,
  });
  res.redirect(`/campgrounds/${campground._id}`);
});

app.delete("/campgrounds/:id", async (req, res) => {
  const { id } = req.params;
  const campground = await CampGround.findByIdAndDelete(id);
  res.redirect(`/campgrounds`);
});

app.listen(3000, () => {
  console.log("Serving on port 3000");
});
