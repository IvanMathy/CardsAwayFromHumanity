
import {onConnection} from "./socket/connectionHandler";
import redisAdapter, { RedisAdapter } from "socket.io-redis";
import { redisClient, redisPublisher } from "./lib/redis";
import SocketIORedis from "socket.io-redis";
import { io } from "./lib/io";



io.adapter(redisAdapter({ host: 'localhost', port: 6379 }));

io.on("connection", onConnection);
