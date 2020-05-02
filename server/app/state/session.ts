import { Socket } from "socket.io";
import { Player } from "./players/player";
import { redisClient } from "../lib/redis";
import { Events, Commands } from "../../../client/shared/events";
import { LocalPlayer } from "./players/localPlayer";
import { Room } from "./room";
import { io } from "../lib/io";


export class Session {

    readonly player: LocalPlayer
    private socket?: Socket

    constructor(socket: Socket, player: LocalPlayer) {
        this.socket = socket
        this.player = player

        player.connect(this)
        this.registerEvents(socket)
    }

    registerEvents(socket: Socket) {

        const session = this

        socket.on(Commands.hostGame, function (data) {
            try {
                session.player.host(data.password)
            } catch (error) {
                console.error("Error in joinGame: ", error)
                session.player.sendEvent(Events.unknownError)
            }
        });

        socket.on(Commands.joinGame, function (this: Session, data) {
            try {
                session.player.attemptJoining(data)
            } catch (error) {
                console.error("Error in joinGame: ", error)
                session.player.sendEvent(Events.unknownError)
            }
        });

        socket.on(Commands.gameCommand, function (this: Session, command, payload) {
            try {
                session.player.joinedRoom?.onGameCommand(session.player.id, command, payload)
            } catch (error) {
                console.error("Error in game command: ", error)
                session.player.sendEvent(Events.unknownError)
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

    watchRoom(room: Room) {
        this.socket?.join(`rooms:${room.roomCode}`)
    }
}