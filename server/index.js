const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("./config");
const cors = require("cors");
const Users = require("./models/users");
const Questions = require("./models/questions");
const Answers = require("./models/answer");
const { default: mongoose } = require("mongoose");

// const bodyParser = require("body-parser");
const app = express();
const PORT = 5000;

// Secret key for JWT signing
const secretKey = "secret-key";

app.use(cors());
// app.use(bodyParser.json());
app.use(express.json());

// Middleware to check for a valid JWT
const authenticateJWT = (req, res, next) => {
  const bearerHeader = req.header("authorization");

  if (!bearerHeader) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const bearer = bearerHeader.split(" ");
  const token = bearer[1];

  req.token = token;
  next();
};

// Registration
app.post("/register", async (req, res) => {
  try {
    const { name, email, password, phoneNumber, count } = req.body;

    // Check if the username already exists
    const existingUser = await Users.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "This email already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const data = await Questions.find({});

    const result = data?.map((item) => item._id);

    const users = new Users({
      ...req.body,
      questions: result,
      password: hashedPassword,
    });
    await users.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Login
app.post("/login", async (req, res) => {
  try {
    const { name, email, password, phoneNumber, count } = req.body;

    // Find the user in the database
    const user = await Users.findOne({ email });

    console.log("user ====>", user);

    if (user) {
      // Compare passwords

      console.log(" user.password ==>", user.password);

      const passwordMatch = await bcrypt.compare(password, user.password);

      console.log("passwordMatch ===>", passwordMatch);

      if (passwordMatch) {
        // Issue JWT token
        const token = jwt.sign({ email: user.email }, secretKey, {
          expiresIn: "1h",
        });

        res.json({ message: "Login successful", token });
      } else {
        res.status(401).send("Invalid password");
      }
    } else {
      res.status(404).send("User not found");
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// add questions
app.post("/addquestion", async (req, res) => {
  try {
    const questions = new Questions(req.body);
    await questions.save();
    res.json(questions);
    let questionId = new mongoose.Types.ObjectId(questions.id);

    await Users.updateMany({ $push: { questions: questionId } });
  } catch (err) {
    console.error(err);
  }
});

// post user
// app.post("/user", async (req, res) => {
//   try {
//     const data = await Questions.find({});

//     const result = data?.map((item) => item._id);

//     const users = new Users({ ...req.body, questions: result });
//     await users.save();

//     console.log("req body ===========", req.body);

//     const user = { ...req.body };

//     const accessToken = jwt.sign(user, secretKey);
//     res.json({ accessToken: accessToken });
//   } catch (err) {
//     console.error(err);
//   }
// });

app.get("/list", async (req, res) => {
  try {
    console.log("req.params.id :>> ", req.params.id);
    const data = await Users.find({});
    res.send(data);
  } catch (err) {
    console.error(err);
  }
});

app.post("/findbyid", async (req, res) => {
  try {
    console.log("req.params.id :>> ", req.params.id);
    console.log("req.body :>> ", req.body);
    const data = await Users.find({ email: req.body.email }).populate({
      path: "questions",
      model: "questions",
    });
    console.log("data :>> ", data);
    res.json(data);
  } catch (err) {
    console.error(err);
  }
});

app.put("/update/:_id", async (req, res) => {
  console.log("req.body :>> ", req.body);
  let data = await Users.updateOne(req.params, { $set: req.body });
  res.send(data);
});

app.get("/allusers", async (req, res) => {
  try {
    const data = await Users.find({}).populate({
      path: "questions",
      model: "questions",
    });
    res.json(data);
  } catch (err) {
    console.error(err);
  }
});

// post answers
app.post("/addanswers", authenticateJWT, async (req, res) => {
  jwt.verify(req.token, secretKey, async (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    } else {
      const { answer, ques, quesId, userID } = req.body;

      // Find the user in the database
      const user = await Answers.findOne({ userID: userID, quesId: quesId });

      console.log("user ===>", user);

      if (!user) {
        const answers = new Answers(req.body);
        await answers.save();
        res.json(answers);
      } else {
        const updatedResult = await Answers.findOneAndUpdate(
          { userID: userID, quesId: quesId },
          {
            answer: answer,
          }
        );
        res.json("data updated");
      }
    }
  });
});

// get answers
app.get("/allanswers/:userID", async (req, res) => {
  console.log("req.params ====>", req.params.userID);
  try {
    const data = await Answers.find({
      userID: req.params.userID,
    }).populate("quesId");
    res.json(data);
  } catch (err) {
    console.error(err);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
