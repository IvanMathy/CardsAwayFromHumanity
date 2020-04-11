import {Player} from "../state/player"
import {Events, Commands} from "../../../client/shared/events"
import { redisClient } from "../lib/redis";
import { Socket } from "net";
import { Session } from "../state/session";

export function onConnection(socket:SocketIO.Socket) {
    console.debug("Hello!")

    var session: Session | undefined = undefined

    socket.emit('test', 'toast')
    
    socket.on('disconnect', function () {
        console.debug("Goodbye!")
        session?.onDisconnect()
    })

    socket.on(Commands.authenticate, function (data, callback: Function) {
        let player = Player.authenticate(data)

        session = new Session(socket, player)

        player.connect(session)
        session.registerEvents(socket)

        callback(player.id)
    })
}