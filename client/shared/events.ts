export enum Events {
    alreadyHosting = "ah",
    cannotJoin = "cj",
    unknownError = "e",
    roomFull = "f",
    invalidPassword = "ip",
    invalidRoomCode = "ir",
    invalidUsername = "iu",
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
    celebratingWinner = "a",
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

export class GameStatePlayer {
    constructor(public name: string, public id: string, public score: number, public host?: boolean, public czar?: boolean, public card?: number, public winner?: boolean) {
    }
}

export class GameState {
    players: GameStatePlayer[] = []
    gameInfo: any = {}

    constructor(
        public stage: GameStage,
        public time: number
    ) { }
}