import { Room } from "./room";
import { RedisClient } from "redis";
import { Events } from "../../../shared/events";

export class Player {
    isHost: boolean = false
    socket: SocketIO.Socket

    hostedRoom?: Room


    constructor(socket: SocketIO.Socket) {
        this.socket = socket
    }

    host(password: string, redis: RedisClient) {
        let room = new Room(redis, password, (success, code) => {
            if (!success) {
                this.socket.emit(Events.roomCreationFailed)
                return
            }
            this.socket.emit(Events.roomCreated, code)

            this.hostedRoom = room
        })

    }
}