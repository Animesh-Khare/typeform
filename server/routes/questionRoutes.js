// routes/questionRoutes.js
const express = require("express");
const questionController = require("../../controllers/questionController");
const router = express.Router();

router.post("/addquestion", questionController.addQuestion);

module.exports = router;
