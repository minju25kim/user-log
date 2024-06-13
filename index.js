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
app.post("/api/users", function (req, res) {
  const username = req.body.username;
  createUser(username);
  res.json({ _id: "id here", username: username });
});

const getUser = require("./myApp.js").getUser;
app.get("/api/users", async function (req, res) {
  const allUser = await getUser();
  res.json(allUser);
});

const saveExercise = require("./myApp.js").saveExercise;
app.post("/api/users/:_id/exercises", async function (req, res) {
  // save the req.body under the user's _id in mongodb;
  const exerciseObj = await saveExercise(req.params._id, req.body);
  // send the res with what it's just saved in users exercise log
  res.json(exerciseObj);
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
