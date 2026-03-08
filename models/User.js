const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  uid: String,
  email: String,
  address: {
    firstname: String,
    lastname: String,
    email: String,
    address: String,
    city: String,
    zip: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("User", userSchema);
