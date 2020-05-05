import { Player, PlayerMessage } from "./player";
import { Room } from "../room";
import { eventEmitter } from "../../lib/event";
import { redisSubscriber, redisPublisher } from "../../lib/redis";
import { state } from "../state";

export enum PlayerCommands {
    successfullyJoined = "sj",
    sendEvent = "se",
    delete = "de"
}

export class ProxyPlayer implements Player {

    constructor(public id: string, public name: string) {

        let key = `user:${this.id}`
        let channelName = `events:from:${key}`

        eventEmitter.on(channelName, this.onMessage)
        redisSubscriber.subscribe(channelName)
    }
    
    onMessage = (message: PlayerMessage) => {
        let key = `user:${this.id}`
        let channelName = `events:from:${key}`

        if(message.type == PlayerCommands.delete) {
            console.log("Got Proxy delete command for id:" + this.id)
            eventEmitter.off(channelName, this.onMessage)
            redisSubscriber.unsubscribe(channelName)
            delete state.players[this.id]
        }
    }

    publish(message: PlayerMessage) {
        redisPublisher.publish(`events:to:user:${this.id}`, JSON.stringify(message))
    }

    sendEvent(event: string, ...args: any[]): void {
        this.publish(new PlayerMessage(PlayerCommands.sendEvent, {event: event, payload: args}))
    }

    successfullyJoinedRoom(room: Room, isHost: boolean) {
        this.publish(new PlayerMessage(PlayerCommands.successfullyJoined, {code: room.roomCode, isHost: isHost}))
    }
}