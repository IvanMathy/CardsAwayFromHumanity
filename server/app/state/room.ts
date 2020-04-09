import { RedisClient } from "redis";
import { isNullOrUndefined } from "util";

// This whole file should use promises.

function randomCode() {
    var out = ""
    for (var i = 0; i++ < 4;) {
        var charCode = Math.floor(Math.random() * (90 - 65) + 65);
        out += String.fromCharCode(charCode);
    }
    return out
}

function tryName(redis: RedisClient, callback: (success: boolean, code?: string) => void, attempt: number) {

    var id = randomCode()

    redis.exists(id, function (err, count) {
        if (count > 0) {
            if (attempt > 20) {
                callback(false) // give up
            } else {
                tryName(redis, callback, attempt + 1)
            }
        } else {
            callback(true, id)
        }
    })

}

export class Room {
    roomCode?: string;
    password: string;

    constructor(redis: RedisClient, password: string, callback: (success: boolean, code?: string) => void) {


        tryName(redis, function (this: Room, success, code) {

            if (!success || code == null) {
                callback(false)
                return
            }

            redis.sadd("rooms", code)


            // Create the room, expire it in 24 hours
            redis.set(`room:${code}`, password, 'EX', 60 * 60 * 24, function (this: Room, err, success) {
                if (success !== "OK") {
                    callback(false)
                    return
                }
                this.roomCode = code
                this.password = password

                callback(true, code)
            })
        }, 0)

        this.password = password
    }

    clear(redis: RedisClient) {
        if(isNullOrUndefined(this.roomCode)) {
            return
        }
        redis.srem("rooms", this.roomCode!)
    }


}