import { state } from "../state";
import { redisClient } from "../../lib/redis";
import { LocalPlayer } from "./localPlayer";
import { randomCode } from "../../lib/generator";
import { ProxyPlayer } from "./proxyPlayer";
import { Room } from "../room";

export enum PlayerKeys {
    name = "name",
    id = "id",
    hosted = "hosted",
    location = "location",
    room = "room"
}

export class Player {

    static getPlayer(playerId: string) {

        return new Promise<Player>((resolve, reject) => {
            let localPlayer = state.players[playerId]
            if (localPlayer !== undefined) {
                console.debug("Found Local Player")
                resolve(localPlayer)
                return
            }

            // Player is on another server

            redisClient.hgetall(`user:${playerId}`, (err, values) => {
                if (err !== null) {
                    reject(err)
                    return 
                }

                console.log("player:" + values)

                try {
                    console.debug("Created Proxy Player")
                    let newPlayer = new ProxyPlayer(values[PlayerKeys.id], values[PlayerKeys.name])
                    state.players[values.id] = newPlayer
                    resolve(newPlayer)

                } catch (error) {
                    reject(error)
                }

            })
        });
    }


    static authenticate(user?: Record<string, string>): LocalPlayer | undefined {
        
        var id = user?.id
        var username = user?.name ?? "Guest"

        if (username == undefined || username.length > 14 || !/^[0-9a-zA-Z_.-]+$/.test(username)) {
            console.debug("Invalid username")
            return undefined
        }

        if (id?.length != 8 || /[^A-Z]/.test(id)) {

            console.debug("New player")
            id = randomCode(8)

        } else {

            var local = state.players[id]

            if (local != null && local instanceof LocalPlayer) {
                console.debug("Recovering session")

                if(username !== undefined) {
                    local.name = username
                }

                return local
            }

            // ID is valid, but unknown to this instance.
            console.debug("Returning player")

        }

        

        let newPlayer = new LocalPlayer(id, username ?? "A dum dum with no name")

        state.players[id] = newPlayer
        return newPlayer

    }
}

export interface Player {

    id: string
    name: string

    sendEvent(event: string, ...args: any[]): void
    successfullyJoinedRoom(room: Room, isHost: boolean): void
    onMessage(message: PlayerMessage): void
}

export class PlayerMessage {
    type: string
    payload: any
    
    constructor(type: string, payload: any) {
        this.type = type
        this.payload = payload
    }
}