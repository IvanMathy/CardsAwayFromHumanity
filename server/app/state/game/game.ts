import { HostedRoom } from "../hostedRoom";
import { Player } from "../players/player";
import { GameState } from "../../../../client/shared/events";

export class GameMessage<GameCommandType>{

    constructor(public playerId: string, public command: GameCommandType, public message: any) {
    }
}

export interface Game<GameCommandType> {
    
    room: HostedRoom

    canPlayerJoin(player: Player): boolean
    playerJoined(player: Player): void
    playerLeft(player: Player): void

    spectatorJoined(player: Player): void

    exportState(): string
    loadState(stateString: string): void

    onMessage(message: GameMessage<GameCommandType>): void

    clean(): void
}