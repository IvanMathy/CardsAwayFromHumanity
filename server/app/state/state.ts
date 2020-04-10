import { Room } from "./room";
import { Player } from "./player";


class State {

    constructor() {
        setInterval(this.clean, 1000);
    }

    rooms:  { [key: string]: Room } = {}
    players:  { [key: string]: Player } = {}

    clean() {
        //
    }
}



export var state = new State()