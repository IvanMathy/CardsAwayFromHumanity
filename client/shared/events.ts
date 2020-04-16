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
    joinedGame = "joined",
    stateChanged = "sc"
}

export enum Commands {
    hostGame = "host",
    joinGame = "join",
    authenticate = "auth"
}

export enum GameState {
    waitingToStart = "w",
    startingRound = "s"
}

export enum GameCommand {
    startGame = "sg",
    pickCard = "pc",
    pickBlackCard = "pb"
}

