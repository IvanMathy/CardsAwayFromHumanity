import { Room, RoomBase, RoomKeys } from "./room";
import { HostedRoom } from "./hostedRoom";
import { RedisClient } from "redis";
import { Events } from "../../../client/shared/events";
import { isDate } from "util";
import { redisClient } from "../lib/redis";
import { randomCode } from "../lib/generator";
import { state } from "./state";
import { Socket } from "socket.io";
import { Session } from "./session";

enum PlayerKeys {
    name = "name",
    id = "id",
    lastSeen = "lastSeen"
}

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

        let key = `users:${id}`

        redisClient.multi()
            // Create the player, expire it in ten minutes
            .hmset(key, 
                PlayerKeys.id, id,
                PlayerKeys.name, name,
                PlayerKeys.lastSeen, new Date().getTime())
            .expire(key, 60 * 10)
            .exec()
    }

    host(password?: string) {

        if (this.isHost) {
            this.session?.emit(Events.alreadyHosting)
            return
        }

        this.isHost = true

        let room = new HostedRoom(this, password, (success, code) => {
            if (!success) {
                this.session?.emit(Events.roomCreationFailed)
                this.isHost = false
                return
            }
            this.session?.emit(Events.roomCreated, code)

            this.hostedRoom = room

        })

    }

    attemptJoining(payload: Record<string, string>) {
    
        let code = payload.gameId.toUpperCase()

        if (code.length != 4 || /[^A-Z]/.test(code)) {
            console.debug("Invalid room code " + code)
            this.sendEvent(Events.invalidRoomCode)
            return
        }

        redisClient.hgetall(`room:${code}`, (err, value) => {
            if (err != null || value == null) {
                this.sendEvent(Events.invalidRoomCode)
                return
            }

            console.log(err)
            console.log(value)

            if(value[RoomKeys.passwordProtected] == String(false)) {
                this.joinRoom(code)
            }

            // Password protected!
            if(payload.password == null) {
                this.sendEvent(Events.passwordNeeded)

            } else if (value[RoomKeys.password] !== payload.password) {
                // Bad way to prevent bruteforce
                setTimeout(() => {
                    this.sendEvent(Events.invalidPassword)
                }, 1500)

            } else {
                // Good to go
                this.joinRoom(code, payload.password)
            }
               
            
        })

    }

    private joinRoom(roomCode: string, password?: string) {
        this.leaveRoom()
        this.isHost = false

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

    renew() {
        let now = new Date().getTime()
        // Reset the expiry timer
        if (this.lastSeen < now - 300000) {
            let key = `users:${this.id}`
            redisClient.multi()
                .expire(`users:${this.id}`, 60 * 10)
                .hset(key, PlayerKeys.lastSeen, String(now))
            this.lastSeen = now
        }
    }

    clean() {
        redisClient.del(`users:${this.id}`)
    }
}