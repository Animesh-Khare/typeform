const mongoose = require("mongoose");
const Questions = require("./questions");

// user model
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  phoneNumber: String,
  count: Number,
  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: "questions" }],
});

module.exports = mongoose.model("users", userSchema);
