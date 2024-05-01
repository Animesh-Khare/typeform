// routes/answerRoutes.js
const express = require("express");
const answerController = require("../../controllers/answerController");
const router = express.Router();

router.post("/addanswer", answerController.addAnswer);
router.get("/allanswers/:userID", answerController.getAllAnswers);

module.exports = router;
