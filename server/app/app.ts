import io from "socket.io";

const server = io.listen(3000);

server.on("connection", function(socket) {
  console.log("user connected");
  socket.emit("welcome", "welcome man");
});

