import { randomCode } from "../../lib/generator";
import { Player } from "../players/player";

export class PlayerState {
    hand: number[] = []
    points = 0
    active = true
    id = randomCode(8)
    
    constructor(public player: Player) {}
} 