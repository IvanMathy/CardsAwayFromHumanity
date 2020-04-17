import { randomCode } from "../../lib/generator";

export class PlayerState {
    hand: number[] = []
    points = 0
    active = true
    id = randomCode(8)
    
    constructor(public name: string) {}
} 