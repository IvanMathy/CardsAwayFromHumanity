import { RedisClient } from "redis";
import { isNullOrUndefined } from "util";
import { state } from "./state";
import { Player } from "./player";
import { redisClient } from "../lib/redis";

export enum RoomKeys {
    password = "password",
    roomCode = "roomCode",
    passwordProtected = "protected"
}

export class RoomBase {

    static getRoom(roomCode: string) {

        return new Promise<Room>((resolve, reject) => {
            let localRoom = state.rooms[roomCode]
            if (localRoom !== null) {
                console.debug("Found Local Room")
                resolve(localRoom)
                return 
            }
            
            // Room is on another server

            redisClient.hgetall(`room:${roomCode}`, (err, values) => {
                if(err !== null) {
                    reject(err)
                    return
                }

                try {
                    console.debug("Created Proxy Room")
                    let newRoom = new ProxyRoom(values.roomCode, values.password)
                    state.rooms[values.roomCode] = newRoom
                    resolve(newRoom)
                    
                } catch (error) {
                    reject(error)
                }
                
            })
        });
    }
}

export interface Room {

    roomCode?: string;
    password?: string;

    playerJoined(player: Player): Promise<Room>
    playerLeft(player: Player): void
}


import { ProxyRoom } from "./proxyRoom";