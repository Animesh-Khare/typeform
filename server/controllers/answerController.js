const jwt = require("jsonwebtoken");
const Answer = require("../models/answer");

const addAnswer = async (req, res) => {
  jwt.verify(req.token, secretKey, async (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    } else {
      const { answer, ques, quesId, userID } = req.body;
      const userAnswer = await Answer.findOne({ userID, quesId });

      if (!userAnswer) {
        const newAnswer = new Answer(req.body);
        await newAnswer.save();
        res.json(newAnswer);
      } else {
        await Answer.findOneAndUpdate({ userID, quesId }, { answer });

        res.json("Answer updated successfully");
      }
    }
  });
};

const getAllAnswers = async (req, res) => {
  try {
    const data = await Answer.find({
      userID: req.params.userID,
    }).populate("quesId");

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { addAnswer, getAllAnswers };
