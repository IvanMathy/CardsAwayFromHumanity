import { Room, RoomBase } from "./room";
import { HostedRoom } from "./hostedRoom";
import { RedisClient } from "redis";
import { Events } from "../../../client/shared/events";
import { isDate } from "util";
import { redisClient } from "../lib/redis";
import { randomCode } from "../lib/generator";
import { state } from "./state";
import { Socket } from "socket.io";

export class Player {

    id?: String

    isHost: boolean = false
    socket: Socket

    hostedRoom?: Room
    joinedRoom?: Room

    constructor(socket: Socket) {
        this.socket = socket
    }

    host(password: string) {

        if (this.isHost) {
            this.socket.emit(Events.alreadyHosting)
            return
        }

        this.isHost = true

        let room = new HostedRoom(password, (success, code) => {
            if (!success) {
                this.socket.emit(Events.roomCreationFailed)
                this.isHost = false
                return
            }
            this.socket.emit(Events.roomCreated, code)

            this.hostedRoom = room

        })

    }

    attemptJoining(roomName: string) {
        if (this.isHost) {
            this.sendEvent(Events.alreadyHosting)
            return
        }

        let code = roomName.toUpperCase()

        if (code.length != 4 || /[^A-Z]/.test(code)) {
            console.debug("Invalid room code " + code)
            this.sendEvent(Events.invalidRoomCode)
            return
        }

        redisClient.sismember("rooms", code, (err, number) => {
            if (number != 1) {
                this.sendEvent(Events.invalidRoomCode)
                return
            }

            this.joinRoom(code)
        })

    }

    private joinRoom(roomCode: string) {
        this.leaveRoom()

        RoomBase.getRoom(roomCode)
            .then((room) => {
                return room.playerJoined(this)

            }).then((room) => {
                this.joinedRoom = room
                this.sendEvent(Events.joinedGame)
            })
            .catch((error) => {
                console.error(error)
            })
    }

    private leaveRoom() {
        if (this.joinedRoom == null) {
            return
        }
        this.joinedRoom.playerLeft(this)
    }

    sendEvent(event: string) {
        this.socket.emit(event)
    }

    reconnect(socket: Socket) {

    }

    authenticate(id?: string): Player {
        if (id !== undefined && id.length == 8 && !/[^A-Z]/.test(id)) {

            var local = state.players[id]

            if (local != null) {
                console.debug("Recovering session")
                local.reconnect(this.socket)
                return local
            }

            // ID is valid, but unknown to this instance.
            console.debug("Returning player")

        } else {
            console.debug("New player")
            id = randomCode(8)
        }

        this.id = id
        state.players[id] = this
        return this


        if (local == null) {
            this.id = id
            state.players[id] = this
            return this
        }



    }
}