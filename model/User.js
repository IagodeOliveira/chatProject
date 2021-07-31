const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  username: { type: String, required: true, minlength: 3, maxlength: 50 },
  password: { type: String, required: true, minlength: 6, maxlength: 100 },
  room: { type: String, required: true },
  idSocket: { type: String, default: "a" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", userSchema);
