const mongoose = require("mongoose");

// answer model
const answersSchema = new mongoose.Schema({
  userID: { type: mongoose.Schema.Types.ObjectId, ref: "questions" },
  quesId: { type: mongoose.Schema.Types.ObjectId, ref: "questions" },
  answer: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
});

module.exports = mongoose.model("answers", answersSchema);
