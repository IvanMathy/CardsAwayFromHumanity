export enum Events {
    alreadyHosting = "ah",
    cannotJoin = "cj",
    unknownError = "e",
    roomFull = "f",
    invalidPassword = "ip",
    invalidRoomCode = "ir",
    passwordNeeded = "pw",
    roomCreated = "r",
    rejoined = "re",
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
    rejoin = "rejoin",
    gameCommand = "gc"
}

export enum GameStage {
    waitingToStart = "w",
    startingRound = "s",
    pickingCards = "p",
    pickingWinner = "c",
    notEnoughPlayers = "n"
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

export enum PlayerLocation {
    none = "n",
    inGame = "i",
    spectating = "s"
}

export class GameState {
    players: {name: string; id: string; score: number; host?: boolean; czar?: boolean; card?: number; winner?: boolean}[] = []
    gameInfo: any = {}

    constructor(
        public stage: GameStage, 
        public time: number
    ) {}
}