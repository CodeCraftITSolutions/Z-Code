const express = require("express");
const mongoose = require("mongoose");
const path  = require('path')
const http = require('http');
const socketIo = require('socket.io');
require("dotenv").config();



const app = require("./app")

const server = http.createServer(app);

const allowedOrigins = process.env.NODE_ENV === 'production'
  ? ['https://zee-code-3234074b267f.herokuapp.com']
  : ['http://localhost:5173', 'https://zee-code-3234074b267f.herokuapp.com']; // Add other local origins if necessary


const io = socketIo(server, {
  credentials: true,

    cors: {
        origin: (origin, callback) => {
          if (allowedOrigins.includes(origin) || !origin) {
            callback(null, true);
          } else {
            callback(new Error('Not allowed by CORS'));
          }
        }
        
    }
});


mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    // app.listen(process.env.PORT, () => {
    //   console.log("Server is running on port " + process.env.PORT);
    // });
  })
  .catch((err) => console.log(err));


  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../Client/dist')));
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../Client/dist', 'index.html'));
    });
}

app.set('socketio', io);
io.on('connection', (socket) => {
  // console.log('a user connected');
  socket.on('disconnect', () => {
      // console.log('user disconnected');
  });
});
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


  module.exports = app;