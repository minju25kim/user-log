const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();

const reset = "\x1b[0m";
const blue = "\x1b[34m";

app.use(cors());
app.use(express.static("public"));

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

const createUser = require("./myApp.js").createUser;
app.post("/api/users", async function (req, res) {
  const username = req.body.username;
  const userObj = await createUser(username);
  res.json(userObj);
});

const getUser = require("./myApp.js").getUser;
app.get("/api/users", async function (req, res) {
  const allUser = await getUser();
  res.json(allUser);
});

const saveUserExercise = require("./myApp.js").saveUserExercise;
app.post("/api/users/:_id/exercises", async function (req, res, next) {
  try {
    const result = await saveUserExercise(req.params._id, req.body);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

const getUserLogs = require("./myApp.js").getUserLogs;
app.get("/api/users/:_id/logs", async function (req, res, next) {
  try {
    const result = await getUserLogs(req.params._id, req.query);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// ERROR HANDLER
app.use(function (err, req, res, next) {
  if (err) {
    res
      .status(err.status || 500)
      .type("txt")
      .send(err.message || "SERVER ERROR");
  }
});

const listener = app.listen(process.env.PORT || 3000, function () {
  console.log(
    "Your app is listening on port " +
      blue +
      "http://localhost:" +
      listener.address().port +
      "/" +
      reset
  );
});
