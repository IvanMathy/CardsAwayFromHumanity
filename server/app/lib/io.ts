import socketIO from "socket.io";

export const io = socketIO.listen(process.env.PORT || 3000);