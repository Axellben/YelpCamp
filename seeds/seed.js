const mongoose = require("mongoose");
const CampGround = require("../models/campground");

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

const campGrounds = [
  {
    title: "Cascada Duruitoarea",
    price: "100",
    description: "Foarte Frumos",
    location: "Iasi",
  },
  {
    title: "Parcul Herastrau",
    price: "200",
    description: "Mai bine ca in Ferentari",
    location: "Bucuresti",
  },
  {
    title: "Comarna din Sus",
    price: "50",
    description: "Ca la mama acasa",
    location: "Iasi",
  },
];

CampGround.insertMany(campGrounds);
