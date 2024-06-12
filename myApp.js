require("dotenv").config();

const mongoose = require("mongoose");
mongoose.connect(process.env.MONGO_URI);

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

const User = mongoose.model("User", userSchema);

const createUser = async (username) => {
  const newUser = new User({
    name: username,
  });
  const createdUser = await newUser.save();
  return createdUser;
};

const getUser = async () => {
  const allUser = await User.find({});
  return allUser;
};

exports.createUser = createUser;
exports.getUser = getUser;
