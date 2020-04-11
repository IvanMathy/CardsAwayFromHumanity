import { Socket } from "socket.io";
import { Player } from "./player";
import { redisClient } from "../lib/redis";
import { Events, Commands } from "../../../client/shared/events";


export class Session {

    readonly player: Player
    private socket?: Socket

    constructor(socket: Socket, player: Player) {
        this.socket = socket
        this.player = player
    }

    registerEvents(socket: Socket) {

        socket.on(Commands.hostGame, function (this: Session, data) {
            this.player.host(data.password)
        });

        socket.on(Commands.joinGame, function (this: Session, data) {
            try {
                this.player.attemptJoining(data.gameId)
            } catch (error) {
                console.error("Error in joinGame: ", error)
                this.player.sendEvent(Events.unknownError)
            }
        });

    }

    emit(event: string | symbol, ...args: any[]): boolean {
        return this.socket?.emit(event, ...args) ?? false
    }

    forceEnd() {
        this.socket?.disconnect(true)
    }

    onDisconnect() {
        this.socket = undefined
        this.player.disconnect(this)
    }
}