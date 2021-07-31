const mongoose = require("mongoose");

const chatSchema = mongoose.Schema({
  username: { type: String, required: true, minlength: 3, maxlength: 20 },
  msg: { type: String, required: true, minlength: 1, maxlength: 100 },
  room: String,
  time: { type: String, required: true },
});

module.exports = mongoose.model("Chat", chatSchema);
