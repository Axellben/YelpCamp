const mongoose = require("mongoose");

const campGroundSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  price: {
    type: String,
  },
  description: {
    type: String,
  },
  location: {
    type: String,
  },
});

const CampGround = mongoose.model("CampGround", campGroundSchema);

module.exports = CampGround;
