import { Player, PlayerMessage } from "./player";
import { Room } from "../room";
import { eventEmitter } from "../../lib/event";
import { redisSubscriber } from "../../lib/redis";

export class ProxyPlayer implements Player {

    id: string

    constructor(id: string) {
        this.id = id


        let key = `player:${this.id}`
        let channelName = `events:from:${key}`

        eventEmitter.on(channelName, this.onMessage)
        redisSubscriber.subscribe(channelName)
    }
    
    onMessage(message: PlayerMessage) {
        
    }

    sendEvent(event: string, payload?: any): void {
        throw new Error("Method not implemented.");
    }

    successfullyJoinedRoom(room: Room) {

    }
}