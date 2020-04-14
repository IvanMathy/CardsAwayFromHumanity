import { Player } from "./player";

export class ProxyPlayer implements Player {

    id: string

    constructor(id: string) {
        this.id = id
    }
}