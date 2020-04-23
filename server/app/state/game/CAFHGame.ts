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

    // State

    timer?: NodeJS.Timeout
    time = 0

    constructor(
        public room: HostedRoom
    ) {}

    // - Event Handling

    onMessage(message: GameMessage<GameCommand>): void {
        console.log(message)
        switch (message.command) {
            case GameCommand.startGame:
                if (this.isHost(message) && this.stage == GameStage.waitingToStart) {
                    console.log("start game")
                    this.newRound()
                }
                break
            case GameCommand.pickCard:
                break
        }
    }

    private isHost(message: GameMessage<GameCommand>) {
        return message.playerId == this.room.host.id
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

        this.setStage(GameStage.startingRound)
    }

    private setStage(newState: GameStage) {
        this.stage = newState

        switch (this.stage) {
            case GameStage.startingRound:
                this.startTimer(10)
                break
            case GameStage.pickingCards:
                this.startTimer(30)
                break
        }

        this.broadcastState()

    }

    private broadcastState() {
        let state = new GameState(this.stage, this.time)

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

    // - Time management

    startTimer(length: number) {
        console.log("starting timer "+length)
        if(this.timer !== undefined) {
            clearInterval(this.timer)
        }
        this.time = length
        this.timer = setInterval(() => { this.tick() }, 1000)
        this.tick()
    }

    tick() {

        let sendTimer = false

        switch (this.stage) {
            case GameStage.startingRound:
            case GameStage.pickingCards:
                sendTimer = true
                break
        }

        if (sendTimer) {
            this.room.send(GameEvents.timer, this.time)
        }
        
        if(this.time-- <= 0) {
            if (this.timer == undefined) {
                console.error("Cannot find timer?!")
                return
            }
            clearInterval(this.timer)
            this.next()
        }
    }

    next() {
        switch (this.stage) {
            case GameStage.startingRound:
                this.setStage(GameStage.pickingCards)
                break
        }
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
        this.broadcastState()
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