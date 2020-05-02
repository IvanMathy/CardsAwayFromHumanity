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
    startedSpectating = "ss",
    joinedGame = "joined"
}

export enum Commands {
    hostGame = "host",
    checkRoom = "check",
    joinGame = "join",
    spectate = "spectate",
    authenticate = "auth",
    gameCommand = "gc"
}

export enum GameStage {
    waitingToStart = "w",
    startingRound = "s",
    pickingCards = "p",
    pickingWinner = "c"
}

export enum GameEvents {
    becomeCzar = "bc",
    stateChanged = "sc",
    timer = "t",
    updateHand = "uh"
}

export enum GameCommand {
    startGame = "sg",
    pickCard = "pc",
    pickBlackCard = "pb"
}

export class GameState {
    players: {name: string; id: string; score: number; host?: boolean; czar?: boolean; card?: number; winner?: boolean}[] = []
    gameInfo: any = {}

    constructor(
        public stage: GameStage, 
        public time: number
    ) {}
}