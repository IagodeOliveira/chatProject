const User = require('../model/User');
const Chat = require('../model/chatModel');
const moment = require('moment');

// Join user to chat
async function userJoin(id, username, room) {
    await User.findOneAndUpdate({username}, {idSocket:id, room},
        {useFindAndModify: false, new: true});
    const user = { id, username, room };
    return user;
}

// Get current user
async function getCurrentUser(id, msg) {
    let user = await User.findOne({ idSocket: id });
    const chat = new Chat({
        username: user.username,
        msg,
        room: user.room,
        time: moment().format('h:mm a')
    });
    await chat.save();
    return user;
}

// User leaves chat
async function userLeave(id) {
    let user = await User.findOneAndUpdate({ idSocket: id }, {room: 'off'},
    {useFindAndModify: false, new: false});
    return user;
}

// Get room users
async function getRoomUsers(room, user) {
    let users = [];
    let usuarios = await User.find({ room });
    usuarios.forEach(usuario => {
      if(usuario != user) {
        users.push(usuario.username);
      }
    })
    return users;
}

// Get all messages from a room
async function updateMessages(room) {
    let msgs = await Chat.find({ room });
    return msgs;
}

module.exports = { 
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers,
    updateMessages
};