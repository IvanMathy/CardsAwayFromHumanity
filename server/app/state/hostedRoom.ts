import { Room, RoomBase } from "./room";
import { state } from "./state";
import { Player } from "./player";
import { redisClient } from "../lib/redis";


// This whole file should use promises.

function randomCode() {
    var out = ""
    for (var i = 0; i++ < 4;) {
        var charCode = Math.floor(Math.random() * (90 - 65) + 65);
        out += String.fromCharCode(charCode);
    }
    return out
}

function tryName(callback: (success: boolean, code?: string) => void, attempt: number) {

    var id = randomCode()

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

            // Use multi here
            redisClient.sadd("rooms", code)


            // Create the room, expire it in 24 hours
            redisClient.set(`room:${code}`, password, 'EX', 60 * 60 * 24, function (this: HostedRoom, err, success) {
                if (success !== "OK") {
                    callback(false)
                    return
                }
                this.roomCode = code
                this.password = password

                state.rooms[code] = this
                
                console.log(state)

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