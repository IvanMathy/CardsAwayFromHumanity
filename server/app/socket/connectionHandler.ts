import {Player} from "../state/player"
import {Events} from "../../../shared/events"
import { redisClient } from "../lib/redis";

export function onConnection(socket:SocketIO.Socket) {
    console.log("Hello!")

    let player = new Player(socket)

    socket.emit('test', 'toast')
    
    socket.on('disconnect', function () {
        console.log('Goodbye!')
    });


    redisClient.set("test", "test")

    socket.on(Events.hostGame, function (data) {
        player.host(data.password)
    });

    socket.on(Events.joinGame, function (data) {
        try {
            player.attemptJoining(data.gameId)
        } catch (error) {
            console.error("Error in joinGame: ", error)
            player.sendEvent(Events.unknownError)
        }
    });



}