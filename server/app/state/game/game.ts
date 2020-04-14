import { HostedRoom } from "../hostedRoom";
import { Player } from "../player";

export class GameMessage<GameCommandType>{
    userId: string
    command: GameCommandType
    message: any

    constructor(userId: string, command: GameCommandType, message: any) {
        this.userId = userId
        this.command = command
        this.message = message
    }
}

export interface Game<GameCommandType> {
    room: HostedRoom
    canPlayerJoin(player: Player): boolean
    playerJoined(player: Player): void
    playerLeft(player: Player): void
    onMessage(message: GameMessage<GameCommandType>): void
    clean(): void
}