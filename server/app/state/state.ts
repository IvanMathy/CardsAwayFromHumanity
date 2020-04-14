import { Room } from "./room";
import { Player } from "./players/player";
import { LocalPlayer } from "./players/localPlayer";

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
}



export var state = new State()