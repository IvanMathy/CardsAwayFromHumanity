import { Player, PlayerMessage } from "./player";
import { Room } from "../room";
import { eventEmitter } from "../../lib/event";
import { redisSubscriber, redisPublisher } from "../../lib/redis";

export enum PlayerCommands {
    successfullyJoined = "sj",
    sendEvent = "se"
}

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

    publish(message: PlayerMessage) {
        redisPublisher.publish(`events:to:player:${this.id}`, JSON.stringify(message))
    }

    sendEvent(event: string, payload?: any): void {
        this.publish(new PlayerMessage(PlayerCommands.sendEvent, {event: event, payload: payload}))
    }

    successfullyJoinedRoom(room: Room) {
        this.publish(new PlayerMessage(PlayerCommands.successfullyJoined, room.roomCode))
    }
}