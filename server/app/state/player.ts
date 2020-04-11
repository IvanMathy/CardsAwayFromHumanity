import { Room, RoomBase } from "./room";
import { HostedRoom } from "./hostedRoom";
import { RedisClient } from "redis";
import { Events } from "../../../client/shared/events";
import { isDate } from "util";
import { redisClient } from "../lib/redis";
import { randomCode } from "../lib/generator";
import { state } from "./state";
import { Socket } from "socket.io";
import { Session } from "./session";

export class Player {


    id: string
    name: string

    isHost: boolean = false
    session?: Session
    lastSeen = new Date().getTime()
    active = true

    hostedRoom?: Room
    joinedRoom?: Room

    constructor(id: string, name: string) {
        this.id = id
        this.name = name
    }

    host(password?: string) {

        if (this.isHost) {
            this.session?.emit(Events.alreadyHosting)
            return
        }

        this.isHost = true

        let room = new HostedRoom(password, (success, code) => {
            if (!success) {
                this.session?.emit(Events.roomCreationFailed)
                this.isHost = false
                return
            }
            this.session?.emit(Events.roomCreated, code)

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
        this.joinedRoom?.playerLeft(this)
    }

    sendEvent(event: string) {
        this.session?.emit(event)
    }

    connect(session: Session) {
        // To avoid multiple tabs logged in as the same user
        this.session?.forceEnd()
        this.active = true
        this.session = session
    }

    disconnect(session: Session) {
        if(session == this.session) {
            this.active = false
            this.lastSeen = new Date().getTime()
            console.log("disconnect")
        }
    }

    static authenticate(user?: Record<string, string>): Player {
        var id = user?.id
        var username = (user?.name as string) ?? "A dum dum with no name."

        if (id?.length != 8 || /[^A-Z]/.test(id)) {
      
            console.debug("New player")
            id = randomCode(8)

        } else {

            var local = state.players[id]

            if (local != null) {
                console.debug("Recovering session")
                return local
            }

            // ID is valid, but unknown to this instance.
            console.debug("Returning player")
       
        }

        console.log(username)

        let newPlayer = new Player(id, username)

        state.players[id] = newPlayer
        return newPlayer

    }
}