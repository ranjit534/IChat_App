const express = require("express");
const app = express();
const server = require("http").Server(app); // Create an HTTP server instance
const io = require("socket.io")(server); // Pass the server instance to Socket.IO
const PORT = process.env.PORT || 8000;

app.use(express.static(__dirname + "/index.html"));

server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

const users = {};

io.on("connection", (socket) => {
  // if any new user joins the chat, let other users know who are already connected.
  socket.on("new-user-joined", (name) => {
    users[socket.id] = name;
    socket.broadcast.emit("user-joined", name);
  });

  // if someone sends a message, broadcast the message to others.
  socket.on("send", (message) => {
    socket.broadcast.emit("receive", {
      message: message,
      name: users[socket.id],
    });
  });

  // if someone leaves the chat, let other users know.
  socket.on("disconnect", () => {
    socket.broadcast.emit("left", users[socket.id]);
    delete users[socket.id];
  });
});
