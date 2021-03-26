const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);

const users = {};

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

//whenever a  user gets connected ,this will be executed
io.on("connection", (socket) => {
  socket.on("user-name", (name) => {
    users[socket.id] = name;
    socket.broadcast.emit("user-connected", name);
  });
  socket.on("send-chat-message", (message) => {
    socket.broadcast.emit("chat-message", {
      message: message,
      name: users[socket.id],
    });
  });

  //Whenever a user gets Disconnected , this will be executed
  socket.on("disconnect", () => {
    console.log("user is disconnected");
  });
});

http.listen(8080, () => {
  console.log("listeng at port 8080");
});
