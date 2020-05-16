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
    winner?: string = undefined

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

                if (this.stage == GameStage.pickingWinner) {
                    this.pickWinner(message)
                    return
                }

                if (this.stage !== GameStage.pickingCards || 
                    typeof message.message[0] !== "number" ||
                    !this.playerStates.hasOwnProperty(message.playerId) ||
                    this.czar == message.playerId
                ) {
                    // TODO: Handle spectator vote

                    return
                }



                try {
                    this.playerStates[message.playerId].pickedcard = message.message[0]
                } catch (error) {
                    this.playerStates[message.playerId].player.sendEvent(Events.unknownError)
                }

                let remainingPlayers = 0

                for (let player in this.playerStates) {
                    if (this.playerStates[player].active && this.czar !== player && this.playerStates[player].pickedcard == undefined) {
                        remainingPlayers++
                    }
                }

                if (remainingPlayers === 0) {
                    this.next()
                }

                break
        }
    }


    pickWinner(message: GameMessage<GameCommand>): void {

        if (this.czar !== message.playerId || !this.playerStates.hasOwnProperty(message.playerId) || typeof message.message[0] !== "number") {
            return
        }

        let winner = Object.values(this.playerStates).find(playerState => playerState.pickedcard === message.message[0]);

        if (winner === undefined) {
            return
        }

        winner.points++

        this.winner = winner?.player.id

        this.next()

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

        let players = Object.values(this.playerStates).filter(state => {
            if (state.pickedcard !== undefined) {
                // Delete the card from the hand
                const index = state.hand.indexOf(state.pickedcard);
                if (index > -1) {
                    state.hand.splice(index, 1);
                }
                
                this.deck.discard(state.pickedcard)

                state.hand.unshift(this.deck.pickCard())
            }
            state.pickedcard = undefined
            if (state.active) {
                state.roundsSinceCzar++
                return true
            } else {
                return false
            }
        })

        players.sort((a, b) => b.roundsSinceCzar - a.roundsSinceCzar);

        let czar = players.shift()

        if (czar == undefined) {
            this.room.send(Events.unknownError)
            return
        }

        czar.roundsSinceCzar = 0
        this.czar = czar.player.id


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
            case GameStage.celebratingWinner:
                this.startTimer(10)
                break
        }

        this.broadcastState()

    }

    private getState(): GameState {
        let state = new GameState(this.stage, this.time)

        for (let playerId in this.playerStates) {
            let playerState = this.playerStates[playerId]

            if (!playerState.connected) {
                playerState.active = false
            }

            if (playerState.active) {
                state.players.push({
                    name: playerState.player.name,
                    id: playerState.id,
                    score: playerState.points,
                    host: (playerId == this.room.host.id) ? true : undefined,
                    card: (this.stage == GameStage.pickingWinner) ? playerState.pickedcard : undefined,
                    czar: this.czar == playerId,
                    winner: this.winner == playerId
                })
            }
        }

        if (this.stage == GameStage.startingRound ||
            this.stage == GameStage.pickingCards ||
            this.stage == GameStage.pickingWinner) {
            state.gameInfo.blackCard = this.blackCard
        }

        console.log(this.winner)

        if (this.stage == GameStage.celebratingWinner && this.winner !== undefined) {
            state.gameInfo.winningCard = this.playerStates[this.winner].pickedcard
        }

        return state
    }

    private broadcastState() {
        this.room.send(GameEvents.stateChanged, this.getState())
    }

    private sendPlayerHand(player: Player) {
        if (this.czar == player.id) {
            player.sendEvent(GameEvents.becomeCzar)
        } else {
            let state = this.playerStates[player.id]
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

        let sendTimer = true

        switch (this.stage) {
            case GameStage.notEnoughPlayers:
            case GameStage.waitingToStart:
                sendTimer = false
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

    checkPlayerCount(): boolean {
        let onlinePlayers = 0

        for (let player in this.playerStates) {
            if (this.playerStates[player].active) {
                onlinePlayers++;
            }
        }

        if (onlinePlayers < GameRules.minPlayers) {
            this.setStage(GameStage.notEnoughPlayers)
            return false
        }

        return true
    }

    next() {

        if (!this.checkPlayerCount()) {
            return
        }

        switch (this.stage) {
            case GameStage.notEnoughPlayers:
                this.newRound()
                break

            case GameStage.startingRound:

                this.winner = undefined

                this.setStage(GameStage.pickingCards)
                break

            case GameStage.pickingCards:
                this.setStage(GameStage.pickingWinner)
                break
            case GameStage.pickingWinner:
                this.setStage(GameStage.celebratingWinner)
                break
            case GameStage.celebratingWinner:
                this.newRound()
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
            this.playerStates[player.id].connected = true
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
            this.playerStates[player.id].connected = false
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

        let currentState = new ExportableState(this.stage, this.blackCard, this.stage != GameStage.waitingToStart, this.deck, this.czar, this.winner)

        for (let playerId in this.playerStates) {
            const state = this.playerStates[playerId]
            if (state.active) {
                currentState.playerStates.push(
                    new ExportablePlayerState(state.id, state.player.id, state.hand, state.points, state.pickedcard)
                )
            }
        }

        return JSON.stringify(currentState)
    }

    loadState(stateString: string) {
        let newState = JSON.parse(stateString) as ExportableState

        console.log("Recovering game")
        console.log(newState)

        this.blackCard = newState.blackCard

        this.czar = newState.czar
        this.winner = newState.winner

        console.log(this.deck)

        this.deck.load(newState.deck)

        console.log(this.deck)

        this.setStage(newState.stage)

        newState.playerStates.forEach(state => {
            Player.getPlayer(state.playerId).then(player => {
                let playerState = new PlayerState(player)
                playerState.id = state.id
                playerState.hand = state.hand
                playerState.points = state.points

                playerState.pickedcard = state.card

                this.playerStates[player.id] = playerState
            })
        })

        console.log(this.playerStates)
    }

}

class ExportablePlayerState {
    constructor(public id: string, public playerId: string, public hand: number[], public points: number, public card?: number) { }
}

class ExportableState {
    playerStates: ExportablePlayerState[] = []

    constructor(
        public stage: GameStage, 
        public blackCard: number, 
        public started: boolean, 
        public deck: Deck, 
        public czar?: string, 
        public winner?: string) {

    }
}