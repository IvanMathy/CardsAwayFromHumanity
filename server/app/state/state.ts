import { Room } from "./room";


class State {
    rooms:  { [key: string]: Room } = {}
}

export var state = new State()