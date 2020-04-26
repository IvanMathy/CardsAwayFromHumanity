import { randomCode } from "../../lib/generator";
import { Player } from "../players/player";

export class PlayerState {
    hand: number[] = []
    points = 0
    active = true
    id = randomCode(8)

    pickedcard?: number
    
    constructor(public player: Player) {}
} 

export class SpectatorState {

    id:String
    
    constructor(player: Player) {
        this.id = player.id
    }
} 