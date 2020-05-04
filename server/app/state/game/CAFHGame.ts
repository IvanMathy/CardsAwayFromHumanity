import { HostedRoom } from "../hostedRoom";
import { Game, GameMessage } from "./game";
import { GameState, GameCommand, Events, GameStage, GameEvents } from "../../../../client/shared/events";
import { Player } from "../players/player";
import { Deck } from "./deck";
import { PlayerState, SpectatorState } from "./playerState";
import { maxHeaderSize } from "http";

const GameRules = {
    maxPlayers: 8,
    minPlayers: 3
}

export class CAFHGame implements Game<GameCommand> {

    stage: GameStage = GameStage.waitingToStart

    deck = new Deck()
    blackCard = 0

    playerStates: Record<string, PlayerState> = {}
    spectatorStates: Record<string, SpectatorState> = {}

    // State

    timer?: NodeJS.Timeout
    time = 0

    czar?: string = undefined

    constructor(
        public room: HostedRoom
    ) { }

    // - Event Handling

    onMessage(message: GameMessage<GameCommand>): void {
        console.log(message)
        switch (message.command) {
            case GameCommand.startGame:
                if (this.isHost(message) && this.stage == GameStage.waitingToStart) {
                    this.startGame()
                }
                break
            case GameCommand.pickCard:
                if(this.stage !== GameStage.pickingCards) {
                    return
                }

                if(!this.playerStates.hasOwnProperty(message.playerId)) {
                    // TODO: Handle spectator vote

                    return
                }

                try {
                    this.playerStates[message.playerId].pickedcard = message.message[0]
                    console.log(this.playerStates[message.playerId])
                } catch (error) {
                    this.playerStates[message.playerId].player.sendEvent(Events.unknownError)
                }
                
                break
        }
    }

    private isHost(message: GameMessage<GameCommand>) {
        return message.playerId == this.room.host.id
    }


    // - Game Lifecycle

    private startGame() {
        // TODO: check player count
        console.log("start game")
        this.newRound()
    }

    private newRound() {

        let players = Object.values(this.playerStates).filter(state => state.active)
        players.forEach(state => state.roundsSinceCzar++)
        players.sort((a, b) => b.roundsSinceCzar - a.roundsSinceCzar);

        let czar = players.shift()

        if (czar == undefined) {
            this.room.send(Events.unknownError)
            return
        }

        czar.roundsSinceCzar = 0
        this.czar = czar.id

        players.forEach(state => {
            this.sendPlayerHand(state.player)
        })
        this.sendPlayerHand(czar.player)

        this.blackCard = this.deck.getBlackCard()

        this.setStage(GameStage.startingRound)
    }

    private setStage(newState: GameStage) {
        let previousStage = this.stage
        this.stage = newState

        switch (this.stage) {
            case GameStage.startingRound:
                this.startTimer(10)
                break
            case GameStage.pickingCards:
                this.startTimer(90)
                break
            case GameStage.pickingWinner:
                this.startTimer(45)
                break
        }

        this.broadcastState()

    }

    private getState(): GameState {
        let state = new GameState(this.stage, this.time)

        for (let playerId in this.playerStates) {
            let playerState = this.playerStates[playerId]

            if (playerState.active) {
                state.players.push({
                    name: playerState.player.name,
                    id: playerState.id,
                    score: playerState.points,
                    host: (playerId == this.room.host.id) ? true : undefined,
                    card: (this.stage == GameStage.pickingWinner) ? playerState.pickedcard : undefined,
                    czar: this.czar == playerState.id
                })
            }
        }

        if (this.stage == GameStage.startingRound || 
            this.stage == GameStage.pickingCards ||
            this.stage == GameStage.pickingWinner) {
            state.gameInfo.blackCard = this.blackCard
        }

        return state
    }

    private broadcastState() {
        this.room.send(GameEvents.stateChanged, this.getState())
    }

    private sendPlayerHand(player: Player) {
        let state = this.playerStates[player.id]
        if (this.czar == state.id) {
            player.sendEvent(GameEvents.becomeCzar)
        } else {
            player.sendEvent(GameEvents.updateHand, state.hand)
        }
    }

    clean(): void {

    }

    // - Time management

    startTimer(length: number) {
        console.log("starting timer " + length)
        if (this.timer !== undefined) {
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

        if (this.time-- <= 0) {
            if (this.timer == undefined) {
                console.error("Cannot find timer?!")
                return
            }
            clearInterval(this.timer)
            this.next()
        }
    }

    next() {

        let onlinePlayers = 0

        for (let player in this.playerStates) {
            if (this.playerStates[player].active) {
                onlinePlayers++;
            }
        }


        console.log(onlinePlayers)

        if (onlinePlayers < GameRules.minPlayers) {
            this.setStage(GameStage.notEnoughPlayers)
            return
        }

        switch (this.stage) {
            case GameStage.notEnoughPlayers:
                this.newRound()
                break
                
            case GameStage.startingRound:
                this.setStage(GameStage.pickingCards)
                break

            case GameStage.pickingCards:
                this.setStage(GameStage.pickingWinner)
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

        if (this.stage == GameStage.notEnoughPlayers) {
            this.next()
        }
    }
    playerLeft(player: Player): void {
        if (this.playerStates.hasOwnProperty(player.id)) {
            console.log("Player Left")
            this.playerStates[player.id].active = false
        } else if (this.spectatorStates.hasOwnProperty(player.id)) {
            console.log("Spectator Left")
            delete this.spectatorStates[player.id]
        }
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

    // - Spectators

    spectatorJoined(player: Player) {
        if (!this.playerStates.hasOwnProperty(player.id)) {
            let state = new SpectatorState(player)
            this.spectatorStates[player.id] = state
        }

        // Spectators don't broadcast state to everyone to avoid
        // flooding players with updates if for some reason some
        // game attracts a lot of peeps.
        player.sendEvent(GameEvents.stateChanged, this.getState())
    }

    // - State Recovery





    exportState(): string {

        let currentState = new ExportableState(this.stage, this.blackCard, this.stage != GameStage.waitingToStart)

        for (let playerId in this.playerStates) {
            const state = this.playerStates[playerId]
            if (state.active) {
                currentState.playerStates.push(
                    new ExportablePlayerState(state.id, state.player.id, state.hand, state.points)
                )
            }
        }

        return JSON.stringify(currentState)
    }

    loadState(stateString: string) {
        let newState = JSON.parse(stateString) as ExportableState

        console.log("Recovering game")

        this.stage = newState.stage
        this.blackCard = newState.blackCard

        newState.playerStates.forEach(state => {
            Player.getPlayer(state.playerId).then(player => {
                let playerState = new PlayerState(player)
                playerState.id = state.id
                playerState.hand = state.hand
                playerState.points = state.points
                
                this.playerStates[player.id] = playerState
            })
        })
    }

}

class ExportablePlayerState {
    constructor(public id: string, public playerId: string, public hand: number[], public points: number) {}
}

class ExportableState {
    playerStates: ExportablePlayerState[] = []

    constructor(public stage: GameStage, public blackCard: number, public started: boolean) {

    }
}