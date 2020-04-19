export enum Events {
    alreadyHosting = "ah",
    cannotJoin = "cj",
    unknownError = "e",
    roomFull = "f",
    invalidPassword = "ip",
    invalidRoomCode = "ir",
    passwordNeeded = "pw",
    roomCreated = "r",
    roomCreationFailed = "rf",
    joinedGame = "joined"
}

export enum Commands {
    hostGame = "host",
    joinGame = "join",
    authenticate = "auth",
    gameCommand = "gc"
}

export enum GameStage {
    waitingToStart = "w",
    startingRound = "s"
}

export enum GameEvents {
    stateChanged = "sc",
    updateHand = "uh"
}

export enum GameCommand {
    startGame = "sg",
    pickCard = "pc",
    pickBlackCard = "pb"
}

export class GameState {
    players: {name: string; id: string; score: number; host?: boolean}[] = []
    stage: GameStage
    gameInfo: any = {}

    constructor(stage: GameStage) {
        this.stage = stage
    }
}