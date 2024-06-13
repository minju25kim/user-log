require("dotenv").config();

const mongoose = require("mongoose");
mongoose.connect(process.env.MONGO_URI);

const exerciseLogSchema = new mongoose.Schema({
  description: String,
  duration: Number,
  date: Date,
});

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  count: {
    type: Number,
  },
  log: [exerciseLogSchema],
});

const User = mongoose.model("User", userSchema);

const createUser = async (username) => {
  const newUser = new User({
    username: username,
  });
  const createdUser = await newUser.save();
  return createdUser;
};

const getUser = async () => {
  const allUser = await User.find({}).select("_id username");
  return allUser;
};

const saveExercise = async (id, exercise) => {
  const { description, duration, date } = exercise;
  // ID VALIDATION
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return { error: "Invalid user ID format" };
  }
  // find user by id
  const idUser = await User.findById(id);
  // SAVE THE EXERCISE IN THE LOG ARRAY IN USER
  const newExercise = {
    description,
    duration,
    date: date ? new Date(date) : new Date(),
  };
  idUser.log.push(newExercise);
  await idUser.save();
  // CREATE THE EXERCISE OBJ TO SEND THE RESPONSE JSON
  const exerciseObj = {
    username: idUser.username,
    description: newExercise.description,
    duration: newExercise.duration,
    date: newExercise.date.toDateString(),
    _id: idUser._id,
  };

  return exerciseObj;
};

exports.createUser = createUser;
exports.getUser = getUser;
exports.saveExercise = saveExercise;
