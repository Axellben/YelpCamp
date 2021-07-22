const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const session = require("express-session");
const methodOverride = require("method-override");
const flash = require("connect-flash");
const ExpressError = require("./utils/ExpressError");
const ejsMate = require("ejs-mate");

const campgrounds = require("./routes/campgrounds");
const reviews = require("./routes/reviews");

// Connect to the database
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
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  })
);
app.use(flash());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

// Express routes
app.get("/", (req, res) => {
  res.render("home");
});

app.use("/campgrounds", campgrounds);
app.use("/campgrounds/:id/reviews", reviews);

// Set an 404 route
app.all("*", (req, res, next) => {
  next(new ExpressError("Page not found", 404));
});

// Error handling
app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Something went wrong";
  res.status(statusCode).render("error", { err });
});

// Start the server
app.listen(3000, () => {
  console.log("Listening on port 3000");
});
