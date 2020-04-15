import { Room, RoomBase, RoomMessage } from "./room";
import { Player } from "./players/player";
import { redisSubscriber, redisPublisher } from "../lib/redis";
import { eventEmitter } from "../lib/event";

export enum RoomCommands {
    tryJoining = "tj"
}

export class ProxyRoom extends RoomBase implements Room {
    roomCode?: string;
    password?: string;


    constructor(code?: string, password?: string) {
        super()
        this.roomCode = code
        this.password = password

        if(this.roomCode === undefined) {
            return
        }

        let key = `room:${this.roomCode}`
        let channelName = `events:from:${key}`

        eventEmitter.on(channelName, this.onMessage)
        redisSubscriber.subscribe(channelName)
    }

    onMessage(message: RoomMessage) {
        
    }

    publish(message: RoomMessage) {
        if(this.roomCode === undefined) return
        redisPublisher.publish(`events:to:room:${this.roomCode}`, JSON.stringify(message))
    }

    // Actions

    tryJoining(player: Player){
        this.publish(new RoomMessage(RoomCommands.tryJoining, player.id))
    }

    playerLeft(player:Player): void {
        throw new Error("Method not implemented.");
    }

    clean() {

        let key = `room:${this.roomCode}`
        let channelName = `events:from:${key}`

        eventEmitter.off(channelName, this.onMessage)
        redisSubscriber.unsubscribe(channelName)
    }


}