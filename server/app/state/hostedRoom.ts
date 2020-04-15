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
import { Events } from "../../../client/shared/events";


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

    players: Record<string, Player> = {}

    game: Game<any> = new CAFHGame(this)


    constructor(host: Player, password: string | undefined, callback: (success: boolean, code?: string) => void) {

        super()

        tryName(function (this: HostedRoom, success, code) {

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

            redisClient.multi()
                .sadd("rooms", code)
                // Create the room, expire it in 24 hours
                .hmset(key, values)
                .expire(key, 60 * 60 * 24)
                .exec(function (this: HostedRoom, err, success) {
                    if (err !== null) {
                        callback(false)
                        return
                    }
                    this.roomCode = code
                    this.password = password

                    state.rooms[code] = this

                    // Set listeners

                    let channelName = `events:to:${key}`

                    eventEmitter.on(channelName, this.onMessage)
                    redisSubscriber.subscribe(channelName)

                    callback(true, code)

                })
        }, 0)

        this.password = password
        this.host = host
        this.players[host.id] = host
    }

    clean() {
        if (this.roomCode == null) {
            return
        }
        redisClient.multi()
            .srem("rooms", this.roomCode)
            .del(`room:${this.roomCode}`)
            .exec()

        delete state.rooms[this.roomCode]
    }

    // Event Handling

    onMessage(message: RoomMessage) {
        switch(message.type) {
            case RoomCommands.tryJoining:
                Player.getPlayer(message.payload).then((player) => {
                    this.tryJoining(player)
                })
                break
        }
    }

    // Player management

    tryJoining(player: Player) {
        if (this.game.canPlayerJoin(player)) {
           this.game.playerJoined(player)
           player.successfullyJoinedRoom(this)
        } else {
            // For now that's the only good reason, but there might be more.
            player.sendEvent(Events.roomFull)
        }
    }

    playerLeft(player: Player): void {
        throw new Error("Method not implemented.");
    }

    send(event: string, data?: any) {
        if (this.roomCode === undefined) {
            return
        }
        io.to(`rooms:${this.roomCode}`).emit(event, data)
    }
}