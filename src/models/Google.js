const mongoose = require("mongoose");

const GoogleSchema = mongoose.Schema({
  image: {
    type: String,
  },
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    Unique: true,
    required: true,
  },
  password: {
    type: String,
  },
  admin: {
    type: Boolean,
    required: true,
    default: false,
  },
  token: {
    type: String,
  },

  confirmed: {
    type: Boolean,
    default: false,
  },
});

const Google = mongoose.model("Google", GoogleSchema);

module.exports = Google;
