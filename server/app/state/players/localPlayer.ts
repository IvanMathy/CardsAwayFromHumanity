import { Room, RoomBase, RoomKeys } from "../room";
import { HostedRoom } from "../hostedRoom";
import { Events, Commands, PlayerLocation } from "../../../../client/shared/events";
import { redisClient, redisSubscriber, redisPublisher } from "../../lib/redis";
import { Session } from "../session";
import { Player, PlayerMessage, PlayerKeys } from "./player";
import { eventEmitter } from "../../lib/event";
import { PlayerCommands } from "./proxyPlayer";
import { state } from "../state";



export class LocalPlayer implements Player {

    isHost: boolean = false
    session?: Session

    hostedRoom?: Room
    joinedRoom?: Room

    constructor(public id: string, public name: string) {

        let key = `user:${id}`

        redisClient.multi()
            // Create the player, expire it in four hours
            .hmset(key,
                PlayerKeys.id, id,
                PlayerKeys.name, name,
                PlayerKeys.hosted, String(true))
            .expire(key, 60 * 60 * 4)
            .exec()

        // Set listeners

        let channelName = `events:to:${key}`

        console.log(channelName)

        this.broadcastDelete()

        eventEmitter.on(channelName, this.onMessage)
        redisSubscriber.subscribe(channelName)

    }

    onMessage = (message: PlayerMessage) => {
        console.log(message)
        switch (message.type) {
            case PlayerCommands.sendEvent:
                this.sendEvent(message.payload.event, ...message.payload.payload)
                break
            case PlayerCommands.successfullyJoined:
                RoomBase.getRoom(message.payload.code).then((room) => {
                    this.successfullyJoinedRoom(room, message.payload.isHost)
                }).catch((err) => {
                    console.error("Error finding room in remote join: ", err)
                })
            case PlayerCommands.delete:

                let key = `user:${this.id}`
                let channelName = `events:to:${key}`

                console.log("Got Proxy delete command for id:" + this.id)
                eventEmitter.off(channelName, this.onMessage)
                redisSubscriber.unsubscribe(channelName)
                delete state.players[this.id]
        }
    }

    host(password?: string) {

        // Should we block hosting a new game? Probably not

        // if (this.isHost) {
        //     this.session?.emit(Events.alreadyHosting)
        //     return
        // }

        this.isHost = true

        let room = new HostedRoom(this, password, undefined, (success, code) => {
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

            if (payload.action == Commands.spectate) {
                this.spectate(code)
                return
            }

            if (value[RoomKeys.passwordProtected] == String(false)) {
                this.joinRoom(code)
                return
            }

            // Password protected!
            if (payload.password == null) {
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

    private checkRoom(room: String) {

    }

    private joinRoom(roomCode: string, password?: string) {

        this.leaveRoom()
        this.isHost = false

        RoomBase.getRoom(roomCode)
            .then((room) => {

                room.tryJoining(this)

            })
            .catch((error) => {
                this.sendEvent(Events.cannotJoin)
            })
    }

    private spectate(roomCode: string) {

        this.leaveRoom()
        this.isHost = false

        RoomBase.getRoom(roomCode)
            .then((room) => {
                this.joinedRoom = room
                room.spectate(this)
                this.session?.watchRoom(room)
                this.setLocation(PlayerLocation.spectating, room.roomCode)
            })
            .catch((error) => {
                this.sendEvent(Events.cannotJoin)
            })
    }

    successfullyJoinedRoom(room: Room, isHost: boolean) {
        this.joinedRoom = room
        this.session?.watchRoom(room)
        this.sendEvent(Events.joinedGame, room.roomCode, isHost)
        this.setLocation(PlayerLocation.inGame, room.roomCode)
    }

    private leaveRoom() {
        this.joinedRoom?.playerLeft(this)
        this.joinedRoom = undefined
    }

    sendEvent(event: string, ...args: any[]) {
        this.session?.emit(event, ...args)
    }

    connect(session: Session) {
        // To avoid multiple tabs logged in as the same user
        this.session?.forceEnd()
        this.session = session
    }

    onDisconnect(session: Session) {
        if (session == this.session) {
            this.leaveRoom()
            delete state.players[this.id]
        }
    }

    setLocation(location: PlayerLocation, room?: string) {
        let key = `user:${this.id}`

        let payload: string[] = [
            PlayerKeys.location, location
        ]

        if (room !== undefined) {
            payload.push(PlayerKeys.room, room)
        }

        redisClient.hmset(key, payload)
    }

    reloadState(): Promise<{location:PlayerLocation, room?: string}> {
        return new Promise((resolve, reject) => {
            redisClient.hgetall(`user:${this.id}`, (err, values) => {
                if(err !== null) {
                    return reject(err)
                }

                let location = values[PlayerKeys.location] as PlayerLocation

                resolve({
                    location: location, 
                    room: values[PlayerKeys.room]
                })

                if(location == PlayerLocation.inGame) {
                    this.joinRoom(values[PlayerKeys.room])
                }
                
            })
        })
    }

    disconnect() {
        console.debug("Saving Player State: " + this.id)

        redisClient.multi()
            .hmset(`user:${this.id}`, [
                PlayerKeys.hosted, String(false)
            ])
            .exec()

        this.broadcastDelete()
    }

    broadcastDelete() {
        let key = `user:${this.id}`
        let message = new PlayerMessage(PlayerCommands.delete, {})

        redisPublisher.publish(`events:from:${key}`, JSON.stringify(message))
        redisPublisher.publish(`events:to:${key}`, JSON.stringify(message))
    }
}