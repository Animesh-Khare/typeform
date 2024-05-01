const Question = require("../models/Question");
const User = require("../models/User");

const addQuestion = async (req, res) => {
  try {
    const question = new Question(req.body);
    await question.save();

    res.json(question);

    const questionId = new mongoose.Types.ObjectId(question.id);

    await User.updateMany({ $push: { questions: questionId } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { addQuestion };
