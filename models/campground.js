const mongoose = require("mongoose");

const campGroundSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  location: { type: String, required: true },
});

const CampGround = mongoose.model("CampGround", campGroundSchema);

module.exports = CampGround;
