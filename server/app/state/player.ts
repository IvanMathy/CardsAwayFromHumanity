export class Player {
    isHost: boolean = false;
    socket: SocketIO.Socket;
    
    constructor(socket: SocketIO.Socket) {
        this.socket = socket;
    }
}