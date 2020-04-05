import {Player} from '../state/player'
import {events} from '../../../shared/events'

export function onConnection(socket:SocketIO.Socket) {
    console.log("Hello!");

    let player = new Player(socket)
    

    setTimeout(function(){ 
        socket.emit("test", "sup");
     }, 3000);

    socket.on('disconnect', function () {
        console.log('Goodbye!');
    });
}