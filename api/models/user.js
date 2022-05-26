const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  contact: {
    type: Number,
    required: true,
    unique: true,
  },
});

module.exports = mongoose.model("User", userSchema);
