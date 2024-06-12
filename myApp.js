require("dotenv").config();

const mongoose = require("mongoose");
mongoose.connect(process.env.MONGO_URI);

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
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

exports.createUser = createUser;
exports.getUser = getUser;
