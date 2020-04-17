import { HostedRoom } from "../hostedRoom";
import { Game, GameMessage } from "./game";
import { GameState, GameCommand, Events, GameStage, GameEvents } from "../../../../client/shared/events";
import { Player } from "../players/player";
import { Deck } from "./deck";
import { PlayerState } from "./playerState";

const GameRules = {
    maxPlayers : 8
}

export class CAFHGame implements Game<GameCommand> {

    stage: GameStage = GameStage.waitingToStart

    deck = new Deck()
    blackCard = 0

    playerStates: Record<string, PlayerState> = {}

    constructor(
        public room: HostedRoom
    ) {}

    // - Event Handling

    onMessage(message: GameMessage<GameCommand>): void {
        switch (message.command) {
            case GameCommand.startGame:
                if (this.isHost(message) && this.stage == GameStage.waitingToStart) {
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

        for (let playerId in this.playerStates) {
            if (this.playerStates[playerId].active) {
                this.sendPlayerHand(this.playerStates[playerId].player)
            }
        }
    }

    private setStage(newState: GameStage) {
        this.stage = newState
        this.broadcastState()
    }

    private broadcastState() {
        let state = new GameState(this.stage)

        for (let playerId in this.playerStates) {
            let playerState = this.playerStates[playerId]

            state.players.push({
                name: playerState.player.name,
                id: playerState.id,
                score: playerState.points,
                host: (playerId == this.room.host.id) ? true : undefined
            })
        }

        if(this.stage == GameStage.startingRound) {
            state.gameInfo.blackCard = this.blackCard
        }
        
        this.room.send(GameEvents.stateChanged, state)
    }

    private sendPlayerHand(player: Player) {
        player.sendEvent(GameEvents.updateHand, this.playerStates[player.id].hand)
    }

    clean(): void {

    }

    // - Player Management

    playerJoined(player: Player): void {
        if (!this.playerStates.hasOwnProperty(player.id)) {
            let state = new PlayerState(player)
            state.hand = this.deck.pickCards(10)
            this.playerStates[player.id] = state
        } else {
            this.playerStates[player.id].active = true
        }

        this.sendPlayerHand(player)
        this.broadcastState()
    }
    playerLeft(player: Player): void {
        this.playerStates[player.id].active = false
    }

    canPlayerJoin(player: Player): boolean {
        let count = 0
        for (let playerId in this.playerStates) {
            if (this.playerStates[playerId].active && playerId !== player.id) {
                count++
            }
        }

        return count < GameRules.maxPlayers
    }
}