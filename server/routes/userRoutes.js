// routes/userRoutes.js
const express = require("express");
const userController = require("../../controllers/userController");
const router = express.Router();

router.put("/update/:_id", userController.updateUser);
router.get("/allusers", userController.getAllUsers);
router.post("/findbyid", userController.getUserById);

module.exports = router;
