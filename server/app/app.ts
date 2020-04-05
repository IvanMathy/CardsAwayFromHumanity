import io from "socket.io";
import {onConnection} from "./socket/connectionHandler";

const server = io.listen(process.env.PORT || 3000);

server.on("connection", onConnection);



