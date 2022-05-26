const mongoose = require("mongoose");

const pathSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  path: {
    data: Buffer,
    contentType: String,
  },
  name: String,
});

module.exports = mongoose.model("Imgpath", pathSchema);
