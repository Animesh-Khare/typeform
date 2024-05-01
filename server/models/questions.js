const mongoose = require("mongoose");

// question model
const questionSchema = new mongoose.Schema({
  question: String,
  name: String,
  type: String,
  required: String,
  options: [String],
});

module.exports = mongoose.model("questions", questionSchema);
