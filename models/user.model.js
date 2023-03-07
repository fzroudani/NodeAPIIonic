const mongoose = require("mongoose");
const Role = require("./role.model");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
    },
  },

  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
