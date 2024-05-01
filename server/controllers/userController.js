const User = require("../models/User");
const Question = require("../models/Question");
const Answer = require("../models/answer");

const updateUser = async (req, res) => {
  try {
    const data = await User.updateOne(
      { _id: req.params._id },
      { $set: req.body }
    );
    res.send(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const data = await User.find({}).populate({
      path: "questions",
      model: "Question",
    });

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getUserById = async (req, res) => {
  try {
    const data = await User.find({ email: req.body.email }).populate({
      path: "questions",
      model: "Question",
    });

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { updateUser, getAllUsers, getUserById };
