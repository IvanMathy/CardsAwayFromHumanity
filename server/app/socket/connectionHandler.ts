import {Player} from "../state/player"
import {Events} from "../../../client/shared/events"
import { redisClient } from "../lib/redis";
import { Socket } from "net";

export function onConnection(socket:SocketIO.Socket) {
    console.log("Hello!")

    console.log(socket.id)
    var player = new Player(socket)

    socket.emit('test', 'toast')
    
    socket.on('disconnect', function () {
        console.log('Goodbye!')
    });


    redisClient.set("test", "test")

    socket.on(Events.hostGame, function (data) {
        if(player == null) {
            return 
        }
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

    socket.on(Events.Commands.authenticate, function (data) {
        player.host(data.password)
    });


}