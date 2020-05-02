import { Room } from "./room";
import { Player } from "./players/player";
import { LocalPlayer } from "./players/localPlayer";
import { redisClient } from "../lib/redis";
import { HostedRoom } from "./hostedRoom";

// clean every 60 seconds
const cleanInterval = 60000

class State {


    constructor() {
        setInterval(() => {
            this.cleanPlayers()
        }, cleanInterval);
    }

    rooms:  { [key: string]: Room } = {}
    players:  { [key: string]: Player } = {}

    cleanPlayers() {

        const cutoff = new Date().getTime() - cleanInterval

        Object.keys(this.players).map((key) => {
            try {
                let value = this.players[key] 
                if (value instanceof LocalPlayer && !value.active && value.lastSeen < cutoff) {
                    // TODO: clean up proxys
                    delete this.players[key] 
                }
            } catch (err) {
                console.error(err)
            }
        })
    }

    destroyAll(): Promise<void> {
        return new Promise((resolve, reject) => {
            let multi = redisClient.multi()

            // Delete all players on this server
            Object.keys(this.players).map((key) => {
                try {
                    let value = this.players[key] 
                    if(value instanceof LocalPlayer) {
                        multi.del(`user:${this.players[key].id}`)
                    }
                } catch(err) {
                    console.error(err)
                }
            })

            // Then delete all rooms
            Object.keys(this.rooms).map((key) => {
                try {
                    let value = this.rooms[key] 
                    if(value instanceof HostedRoom) {
                        (value as HostedRoom).disconnect()
                    }
                } catch(err) {
                    console.error(err)
                }
            })

            multi.exec((err)=> {
                resolve()
            })
        })
    }
}



export var state = new State()