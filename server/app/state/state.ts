import { Room } from "./room";
import { Player } from "./player";

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
                if (!value.active && value.lastSeen < cutoff) {
                    delete this.players[key] 
                }
            } catch (err) {
                console.error(err)
            }
        })
    }
}



export var state = new State()