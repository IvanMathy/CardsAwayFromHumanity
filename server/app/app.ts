
import {onConnection} from "./socket/connectionHandler";
import redisAdapter, { RedisAdapter } from "socket.io-redis";
import { redisClient, redisPublisher, redisSubscriber } from "./lib/redis";
import SocketIORedis from "socket.io-redis";
import { io } from "./lib/io";
import { eventEmitter } from "./lib/event";



io.adapter(redisAdapter({ host: 'localhost', port: 6379 }));

io.on("connection", onConnection);



redisSubscriber.on("message", function(channel, message) {
    console.log(channel, message)
    try {
        eventEmitter.emit(channel, JSON.parse(message))
    } catch (error) {
        console.error(error)
    }
})