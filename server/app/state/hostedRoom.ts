import { Room, RoomBase, RoomKeys, RoomMessage } from "./room";
import { state } from "./state";
import { Player } from "./players/player";
import { redisClient, redisSubscriber } from "../lib/redis";
import { randomCode } from "../lib/generator";
import { CAFHGame } from "./game/CAFHGame";
import { Game, GameMessage } from "./game/game";
import { io } from "../lib/io";
import { eventEmitter } from "../lib/event";
import { RoomCommands } from "./proxyRoom";
import { Events, GameCommand } from "../../../client/shared/events";


// This whole file should use promises.


function tryName(callback: (success: boolean, code?: string) => void, attempt: number) {

    var id = randomCode(4)

    redisClient.exists(id, function (err, count) {
        if (count > 0) {
            if (attempt > 20) {
                callback(false) // give up
            } else {
                tryName(callback, attempt + 1)
            }
        } else {
            callback(true, id)
        }
    })

}

export class HostedRoom extends RoomBase implements Room {
    roomCode?: string
    password?: string
    host: Player

    game: Game<any> = new CAFHGame(this)

    constructor(host: Player, password: string | undefined, data: any | undefined, callback: (success: boolean, code?: string) => void) {

        super()


        this.password = password
        this.host = host

        if (data !== undefined) {

            let roomCode = data.roomCode

            console.log(`Recovering ${roomCode}`)


            this.roomCode = roomCode
            this.password = password

            state.rooms[roomCode] = this

            let key = `room:${data.roomCode}`

            // Set listeners

            let channelName = `events:to:${key}`

            eventEmitter.on(channelName, this.onMessage)
            redisSubscriber.subscribe(channelName)

            this.game.loadState(data.gameState)

            redisClient.multi()
                // Take ownership of the room, expire it in 24 hours
                .hmset(key, RoomKeys.hosted, String(true))
                .expire(key, 60 * 60 * 24)
                .exec(function (err, success) {
                    if (err !== null) {
                        callback(false)
                        return
                    }
                    callback(true, roomCode)

                })

            return
        }

        let room = this
        tryName(function (success, code) {

            if (!success || code == null) {
                callback(false)
                return
            }

            let key = `room:${code}`

            var values = [RoomKeys.roomCode, code]

            if (password == undefined) {
                values.push(RoomKeys.passwordProtected, String(false))
            } else {
                values.push(RoomKeys.passwordProtected, String(true))
                values.push(RoomKeys.password, password)
            }

            values.push(RoomKeys.hosted, String(true))
            values.push(RoomKeys.host, room.host.id)

            redisClient.multi()
                // Create the room, expire it in 24 hours
                .hmset(key, values)
                .expire(key, 60 * 60 * 24)
                .exec(function (err, success) {
                    if (err !== null) {
                        callback(false)
                        return
                    }
                    room.roomCode = code
                    room.password = password

                    state.rooms[code] = room

                    // Set listeners

                    let channelName = `events:to:${key}`

                    eventEmitter.on(channelName, room.onMessage)
                    redisSubscriber.subscribe(channelName)

                    callback(true, code)

                })
        }, 0)

    }

    clean() {
        if (this.roomCode == null) {
            return
        }
        redisClient.multi()
            .del(`room:${this.roomCode}`)
            .exec()

        delete state.rooms[this.roomCode]
    }

    disconnect() {
        if (this.roomCode == null) {
            return
        }
        console.debug("Saving Room State: " + this.roomCode)

        redisClient.multi()
            .hmset(`room:${this.roomCode}`, [
                RoomKeys.hosted, String(false),
                RoomKeys.gameState, this.game.exportState()
            ])
            .exec()
    }

    // Event Handling

    onGameCommand(playerId: string, command: GameCommand, ...args: any[]) {
        this.game.onMessage(new GameMessage(playerId, command, args))
    }

    onMessage = (message: RoomMessage) => {
        switch (message.type) {
            case RoomCommands.tryJoining:
                console.log("remote join")
                Player.getPlayer(message.payload).then((player) => {
                    this.tryJoining(player)
                })
                return
            case RoomCommands.spectate:
                console.log("spectate join")
                Player.getPlayer(message.payload).then((player) => {
                    this.tryJoining(player)
                })
                return
            case RoomCommands.playerLeft:
                Player.getPlayer(message.payload).then((player) => {
                    this.playerLeft(player)
                })
                return
            case RoomCommands.gameCommand:
                this.onGameCommand(message.payload.playerId, message.payload.command, message.payload.args)
                break
        }

    }

    // Player management

    tryJoining(player: Player) {
        if (this.game.canPlayerJoin(player)) {
            console.log("success joining")
            player.successfullyJoinedRoom(this, player.id == this.host.id)
            this.game.playerJoined(player)
        } else {
            console.log("room full")
            // For now that's the only good reason, but there might be more.
            player.sendEvent(Events.roomFull)
        }
    }

    spectate(player: Player) {
        this.game.spectatorJoined(player)
        player.sendEvent(Events.startedSpectating, this.roomCode, player.id == this.host.id)
    }


    playerLeft(player: Player): void {
        //
        this.game.playerLeft(player)
    }

    send(event: string, data?: any) {
        if (this.roomCode === undefined) {
            console.error("room code unknown")
            return
        }
        io.to(`rooms:${this.roomCode}`).emit(event, data)
    }
}