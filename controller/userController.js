const User = require("../model/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { registerValidate, loginValidate } = require("./validate");

const userController = {};

userController.register = async function (req, res) {
  const selectedUser = await User.findOne({ username: req.body.username });
  const { error } = registerValidate(req.body);
  if (error) {
    return res.status(400).send(error.message);
  }

  if (selectedUser) {
    return res.status(400).send("Username already registered");
  }
  const user = new User({
    username: req.body.username,
    password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10)),
    room: "off",
  });
  try {
    const savedUser = await user.save();
    res.send("Registered new user: " + savedUser);
  } catch (err) {
    res.status(400).send("User could not be registered");
  }
};

userController.login = async function (req, res) {
  let username = req.body.username;
  let password = req.body.password;
  let room = req.body.room;

  let selectedUser = await User.findOneAndUpdate(
    { username },
    { room },
    { useFindAndModify: false, new: true }
  );
  if (!selectedUser) {
    return res.status(400).send("Username or Password incorrect");
  }

  const { error } = loginValidate(req.body);
  if (error) {
    return res.status(400).send(error.message);
  }

  let pass = bcrypt.compareSync(password, selectedUser.password);
  if (!pass) return res.status(400).send("Username or Password incorrect");

  const token = jwt.sign(
    { id: selectedUser.id, username, room: selectedUser.room },
    process.env.TOKEN_SECRET,
    { expiresIn: 30 }
  );
  res.header("authorization-token", token);
  res.send();
};

userController.chat = async function (req, res) {
  if (!req.user) {
    return res.status(401).send("Restricted Area");
  } else {
    res.header("username", req.user.username);
    res.header("room", req.user.room);
    res.send();
  }
};

userController.find = async (username) => {
  const msgs = await User.findOne({ username });
  return msgs;
};

userController.error = function (req, res) {
  res.redirect("/#404");
};

module.exports = userController;
