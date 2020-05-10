import { Player } from "../state/players/player"
import { Events, Commands } from "../../../client/shared/events"
import { redisClient } from "../lib/redis";
import { Socket } from "net";
import { Session } from "../state/session";

export function onConnection(socket: SocketIO.Socket) {
    console.debug("Hello!")

    var session: Session | undefined = undefined

    socket.on('disconnect', function () {
        console.debug("Goodbye!")
        session?.onDisconnect()
    })

    socket.on(Commands.authenticate, function (data, callback: Function) {

        try {
            if (session !== undefined) {
                return
            }

            let player = Player.authenticate(data)

            if (player == undefined) {
                socket.emit(Events.invalidUsername)
                return
            }

            session = new Session(socket, player)

            callback(player.id)
        } catch (err) {
            console.error(err)
            socket.emit(Events.unknownError)
        }

    })
    socket.on(Commands.rejoin, function (data, callback: Function) {


        try {
            if (session !== undefined) {
                return
            }

            console.log("Player Rejoined: " + data.id)

            let player = Player.authenticate(data)

            if (player == undefined) {
                socket.emit(Events.invalidUsername)
                return
            }

            player.reloadState().then((location) => {
                callback(player!.id, location.location, location.room)
            }).catch((err) => {
                console.error(err)
                socket.emit(Events.unknownError)
            })

            session = new Session(socket, player)

        } catch (err) {
            console.error(err)
            socket.emit(Events.unknownError)
        }

    })
}