import {Player} from "../state/player"
import {Events} from "../../../shared/events"

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
        player.host(data.password, redis)
    });

    socket.on(Events.joinGame, function (data) {
        try {
            player.attemptJoining(data.gameId, redis)
        } catch (error) {
            console.error("Error in joinGame: ", error)
            player.sendEvent(Events.unknownError)
        }
    });



}