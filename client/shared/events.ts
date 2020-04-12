export enum Events {
    joinedGame = "s",
    roomCreated = "r",
    roomCreationFailed = "rf",
    alreadyHosting = "ah",
    invalidRoomCode = "ir",
    unknownError = "e",
    passwordNeeded = "pw",
    invalidPassword = "ip"
}

export enum Commands {
    hostGame= "host",
    joinGame= "join",
    authenticate = "auth"
}