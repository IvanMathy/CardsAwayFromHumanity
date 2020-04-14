export enum Events {
    joinedGame = "s",
    roomCreated = "r",
    roomCreationFailed = "rf",
    alreadyHosting = "ah",
    invalidRoomCode = "ir",
    unknownError = "e",
    passwordNeeded = "pw",
    invalidPassword = "ip",
    stateChanged = "sc"
}

export enum Commands {
    hostGame= "host",
    joinGame= "join",
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

