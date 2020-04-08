import {Player} from "../state/player"
import {Events} from "../../../shared/events"
import { Room } from "../state/room";

export function onConnection(socket:SocketIO.Socket) {
    let redis = (socket.adapter as any).pubClient
    console.log("Hello!")

    let player = new Player(socket)

    socket.emit('test', 'toast')
    
    socket.on('disconnect', function () {
        console.log('Goodbye!')
    });


    redis.set("test", "test")

    socket.on(Events.hostGame, function (data) {
        let room = new Room(redis, data.password, function(success, code) {
            if (!success) {
                socket.emit(Events.roomCreationFailed)
                return
            }

            socket.emit(Events.roomCreated, code)

        })
    });



}