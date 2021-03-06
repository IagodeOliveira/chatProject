const express = require('express');
const app = express();
const path = require('path');
const http = require('http');
const mongoose = require('mongoose');
require('dotenv').config();
const formatMessage = require('./utils/messages');
const userRouter = require('./routes/userRouter');
const { userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
  updateMessages
  } = require('./utils/users');
const socketIO = require('socket.io');
const PORT = process.env.PORT || 3000;

// Database Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

mongoose.connection.on('error', () => { 
  console.log('An error happend on connection');
});

mongoose.connection.once('open', () => {
  const server = http.createServer(app);
  const io = socketIO(server);

  // Setting static folder
  app.use(express.static(path.join(__dirname, 'public')));
  app.use('/', express.json(), userRouter);

  const botName = 'ChatCord Bot';

  // Run when a client connects
  io.on('connection', socket => {
    socket.on('joinRoom', ({ username, room }) => {
      userJoin(socket.id, username, room).then(user => {
        socket.join(user.room);

        // Welcome current user
        socket.emit('message',
          formatMessage(botName, `Welcome to ChitChat ${username}`));

        // Broadcast when a user connects
        socket.broadcast.
          to(user.room).
            emit('message',
              formatMessage(botName, `${username} has joined the chat`));

        // Send users and room info
        getRoomUsers(user.room, user.username).then(res => {
          io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: res
          });
        }).catch((error) => {
          console.log(error);
        });

        // Update messages
        updateMessages(user.room).then(res => {
          if(res.length > 0) {
            socket.emit('messages', { msgs: res });
          }
        }).catch((error) => {
          console.log(error);
        });
      }).catch((error) => {
        console.log(error);
      });
    });

    // Listen for chat message
    socket.on('chatMessage', msg => {
      getCurrentUser(socket.id, msg).then(user => {
        io.to(user.room).emit('message',
          formatMessage(user.username, msg));
      }).catch((error) => {
        console.log(error);
      });
    });

    // Runs when a client disconnects
    socket.on('disconnect', () => {
      userLeave(socket.id).then(user => {
        if(user) {
          io.to(user.room).
            emit('message',
              formatMessage(botName, `${user.username} has left the chat`));

          // Send users and room info
          getRoomUsers(user.room).then(res => {
            io.to(user.room).emit('roomUsers', { 
              room: user.room,
              users: res
            });
          }).catch((error) => {
            console.log(error);
          });
        }
      }).catch((error) => {
        console.log(error);
      });
    });
  });

  server.listen( PORT, () => {
    console.log(`Server running on port: ${PORT}`);
  });
});