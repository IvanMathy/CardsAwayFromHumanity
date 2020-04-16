import { HostedRoom } from "../hostedRoom";
import { Game, GameMessage } from "./game";
import { GameState, GameCommand, Events } from "../../../../client/shared/events";
import { Player } from "../players/player";
import { Deck } from "./Deck";
import { PlayerState } from "./playerState";

const GameRules = {
    maxPlayers : 8
}

export class CAFHGame implements Game<GameCommand> {
    room: HostedRoom
    state: GameState = GameState.waitingToStart

    deck = new Deck()
    blackCard = 0

    playerStates: Record<string, PlayerState> = {}

    constructor(room: HostedRoom) {
        this.room = room
    }

    // - Event Handling

    onMessage(message: GameMessage<GameCommand>): void {
        switch (message.command) {
            case GameCommand.startGame:
                if (this.isHost(message) && this.state == GameState.waitingToStart) {
                    this.newRound()
                }
                break
            case GameCommand.pickCard:
                break
        }
    }

    private isHost(message: GameMessage<GameCommand>) {
        return message.userId == this.room.host.id
    }


    // - Game Lifecycle

    private startGame() {

    }

    private newRound() {    
        this.blackCard = this.deck.getBlackCard()
    }

    private setState(newState: GameState) {
        this.state = newState
        this.room.send(Events.stateChanged, newState)
    }

    clean(): void {

    }

    // - Player Management

    playerJoined(player: Player): void {
        if (!this.playerStates.hasOwnProperty(player.id)) {
            let state = new PlayerState()
            state.hand = this.deck.pickCards(10)
            this.playerStates[player.id] = state
        } else {
            this.playerStates[player.id].active = true
        }
    }
    playerLeft(player: Player): void {
        this.playerStates[player.id].active = false
    }

    canPlayerJoin(player: Player): boolean {
        let count = 0
        for (let playerId in this.playerStates) {
            if (this.playerStates[playerId].active) {
                count++
            }
        }

        return count < GameRules.maxPlayers
    }
}