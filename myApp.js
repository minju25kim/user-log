require("dotenv").config();

const mongoose = require("mongoose");
mongoose.connect(process.env.MONGO_URI);

const exerciseLogSchema = new mongoose.Schema({
  description: String,
  duration: Number,
  date: String,
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
  const savedUser = await newUser.save();
  const createdUser = JSON.parse(JSON.stringify(savedUser));
  return { _id: createdUser._id, username: createdUser.username };
};

const getUser = async () => {
  const allUser = await User.find({}).select("_id username");
  return allUser;
};

const saveUserExercise = async (id, exercise) => {
  const { description, duration, date } = exercise;
  if (!description || !duration) {
    throw new Error("Description or duration or both are missing");
  }
  try {
    const user = await User.findById(id);
    if (!user) {
      throw new Error(`User with id ${id} not found`);
    }
    user.log.push({
      description: description,
      duration: parseInt(duration),
      date: date ? new Date(date).toDateString() : new Date().toDateString(),
    });
    user.count = user.log.length;
    await user.save();
    const exerciseObj = {
      _id: user._id,
      username: user.username,
      description: description,
      duration: parseInt(duration),
      date: date ? new Date(date).toDateString() : new Date().toDateString(),
    };
    return exerciseObj;
  } catch (error) {
    throw new Error(`Failed to save exercise: ${error.message}`);
  }
};

const getUserLogs = async (id) => {
  //   const { from, to, limit } = query;
  const user = await User.findById(id);
  //   const filteredLogs = user.log.filter((log) => {
  //     return (
  //       new Date(log.date) < new Date(to) && new Date(log.date) > new Date(from)
  //     );
  //   });
  //   const limitedLogs = limit ? filteredLogs.slice(0, limit) : filteredLogs;
  //   user.log = limitedLogs;

  //   console.log(user.log);
  return user;
};

exports.createUser = createUser;
exports.getUser = getUser;
exports.saveUserExercise = saveUserExercise;
exports.getUserLogs = getUserLogs;
