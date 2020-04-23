import {onConnection} from "./socket/connectionHandler";
import redisAdapter, { RedisAdapter } from "socket.io-redis";
import { redisClient, redisPublisher, redisSubscriber, redisSettings } from "./lib/redis";
import { io } from "./lib/io";
import { eventEmitter } from "./lib/event";
import { state } from "./state/state";



io.adapter(redisAdapter(redisSettings));

io.on("connection", onConnection);

console.log("Howdy earth")



redisSubscriber.on("message", function(channel, message) {
    console.log(channel, message)
    try {
        eventEmitter.emit(channel, JSON.parse(message))
    } catch (error) {
        console.error(error)
    }
})

redisSubscriber.on('error', function(err){
    console.error("Redis SUB: ", err)
});
redisPublisher.on('error', function(err){
    console.error("Redis PUB: ", err)
});
redisClient.on('error', function(err){
    console.error("Redis: ", err)
});

process.on('SIGINT', function() {
    console.log("Interrupt signal, cleaning up");
    state.destroyAll().then(()=> {
        
        process.exit()
    })
});

process.on('SIGTERM', function() {
    console.log("Termination signal, cleaning up");
    state.destroyAll().then(()=> {
        process.exit()
    })

});

