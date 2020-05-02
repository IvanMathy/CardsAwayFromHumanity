import { RedisClient } from "redis";
import { isNullOrUndefined } from "util";
import { state } from "./state";
import { Player } from "./players/player";
import { redisClient } from "../lib/redis";

export enum RoomKeys {
    password = "password",
    roomCode = "roomCode",
    passwordProtected = "protected",
    hosted = "hosted",
    gameState = "gameState",
    host = "host"
}


export class RoomBase {

    static getRoom(roomCode: string) {

        return new Promise<Room>((resolve, reject) => {
            let localRoom = state.rooms[roomCode]
            if (localRoom !== undefined) {
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

                    if(values.hosted == String(false)) {
                        this.rehostRoom(values, resolve, reject)
                        return
                    }
                    
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

    static rehostRoom(values: any, resolve: (room: Room) => void, reject: (reason: any) => void) {
        
        let room = new HostedRoom(values[RoomKeys.roomCode], values[RoomKeys.password], values, (success, code) => {

            if (!success) {
                reject("Cannot Find Room")
                return
            }

            Player.getPlayer(values[RoomKeys.host]).then(player => {
                room.host = player
                resolve(room)
            }).catch(reason => {
                reject(reason)
            })
            
        })
    }
}

export interface Room {

    roomCode?: string;
    password?: string;

    tryJoining(player: Player): void
    playerLeft(player: Player): void
    spectate(player: Player): void

    onMessage(message: RoomMessage): void
    onGameCommand(playerId: string, command: GameCommand, ...args: any[]): void

    clean(): void
}

export class RoomMessage {
    type: string
    payload: any
    
    constructor(type: string, payload: any) {
        this.type = type
        this.payload = payload
    }
}


import { ProxyRoom } from "./proxyRoom";
import { GameState, GameCommand } from "../../../client/shared/events";import { HostedRoom } from "./hostedRoom";

