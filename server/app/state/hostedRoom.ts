import { Room, RoomBase, RoomKeys } from "./room";
import { state } from "./state";
import { Player } from "./player";
import { redisClient } from "../lib/redis";
import { randomCode } from "../lib/generator";


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
    roomCode?: string;
    password?: string;


    constructor(password: string, callback: (success: boolean, code?: string) => void) {

        super()

        tryName(function (this: HostedRoom, success, code) {

            if (!success || code == null) {
                callback(false)
                return
            }

            let key = `room:${code}`

            redisClient.multi()
                .sadd("rooms", code)
                // Create the room, expire it in 24 hours
                .hmset(key,
                    RoomKeys.password, password,
                    RoomKeys.roomCode, code
                )
                .expire(key, 60 * 60 * 24)
                .exec(function (this: HostedRoom, err, success) {
                    if (err !== null) {
                        callback(false)
                        return
                    }
                    this.roomCode = code
                    this.password = password

                    state.rooms[code] = this

                    callback(true, code)
                })
        }, 0)

        this.password = password
    }

    clear() {
        if(this.roomCode == null) {
            return
        }
        redisClient.multi()
            .srem("rooms", this.roomCode)
            .del(`room:${this.roomCode}`)
            .exec()

        delete state.rooms[this.roomCode]
    }

      
    playerJoined(player: Player): Promise<Room> {
        throw new Error("Method not implemented.");
    }
    playerLeft(player:Player): void {
        throw new Error("Method not implemented.");
    }
}