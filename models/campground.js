const mongoose = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema;

const campGroundSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  image: {
    type: String,
  },
  price: {
    type: Number,
  },
  description: {
    type: String,
  },
  location: { type: String },
  reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
  author: { type: Schema.Types.ObjectId, ref: "User" },
});

campGroundSchema.post("findOneAndDelete", async function (campground) {
  campground.reviews.forEach(async (review) => {
    await Review.findOneAndRemove({ _id: review._id });
  });
});

const CampGround = mongoose.model("CampGround", campGroundSchema);

module.exports = CampGround;
