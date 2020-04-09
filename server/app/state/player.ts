import { Room } from "./room";
import { RedisClient } from "redis";
import { Events } from "../../../shared/events";
import { isDate } from "util";

export class Player {
    isHost: boolean = false
    socket: SocketIO.Socket

    hostedRoom?: Room
    joinedRoom?: Room

    constructor(socket: SocketIO.Socket) {
        this.socket = socket
    }

    host(password: string, redis: RedisClient) {

        if(this.isHost) {
            this.socket.emit(Events.alreadyHosting)
            return
        }

        this.isHost = true

        let room = new Room(redis, password, (success, code) => {
            if (!success) {
                this.socket.emit(Events.roomCreationFailed)
                this.isHost = false
                return
            }
            this.socket.emit(Events.roomCreated, code)

            this.hostedRoom = room

        })

    }

    attemptJoining(roomName: string, redis: RedisClient) {
        if(this.isHost) {
            this.sendEvent(Events.alreadyHosting)
            return
        }



        let code = roomName.toUpperCase()



        if (code.length != 4 || !/[^A-Z]/.test(code)) {
            this.sendEvent(Events.invalidRoomCode)
            return
        }

        redis.sismember("rooms", code, (err, number) => {
            if (number != 1) {
                this.sendEvent(Events.invalidRoomCode)
                return
            }

            this.joinRoom(code)
        })

    }

    private joinRoom(roomcode: String) {
        this.leaveRoom()
    }

    private leaveRoom() {
        //this.joinedRoom?.playerLeft(this)
    }

    sendEvent(event:string) {
        this.socket.emit(event) 
    }
}