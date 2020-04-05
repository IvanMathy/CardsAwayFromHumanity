import io from "socket.io";
import {onConnection} from "./socket/connectionHandler";
import redisAdapter from "socket.io-redis";


const server = io.listen(process.env.PORT || 3000);

server.adapter(redisAdapter({ host: 'localhost', port: 6379 }));

server.on("connection", onConnection);



