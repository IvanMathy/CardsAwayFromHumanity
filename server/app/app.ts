import io from "socket.io";

const server = io.listen(process.env.PORT || 3000);

server.on("connection", function (socket) {
    console.log("Hello!");
    

    setTimeout(function(){ 
        socket.emit("test", "sup");
     }, 3000);

    socket.on('disconnect', function () {
        console.log('Goodbye!');
    });
});



