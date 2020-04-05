import {Player} from '../state/player'
import {Events} from '../../../shared/events'

export function onConnection(socket:SocketIO.Socket) {
    console.log("Hello!");

    let player = new Player(socket)
    
    socket.on('disconnect', function () {
        console.log('Goodbye!');
    });

    socket.on(Events.hostGame, function (data) {
        
    })
}