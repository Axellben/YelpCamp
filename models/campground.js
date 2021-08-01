const mongoose = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema;

const ImageSchema = new Schema({ url: String, filename: String });

ImageSchema.virtual("thumbnail").get(function () {
  return this.url.replace("/upload/", "/upload/w_200/");
});

const opts = { toJSON: { virtuals: true } };

const campGroundSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    images: [ImageSchema],
    geometry: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
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
  },
  opts
);

campGroundSchema.virtual("properties.popUpMarker").get(function () {
  return `<strong><a href="/campgrounds/${this._id}">${this.title}</a></strong>`;
});

campGroundSchema.post("findOneAndDelete", async function (campground) {
  campground.reviews.forEach(async (review) => {
    await Review.findOneAndRemove({ _id: review._id });
  });
});

const CampGround = mongoose.model("CampGround", campGroundSchema);

module.exports = CampGround;
