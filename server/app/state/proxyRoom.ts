import { Room, RoomBase } from "./room";
import { Player } from "./player";

export class ProxyRoom extends RoomBase implements Room {
    roomCode?: string;
    password?: string;


    constructor(code?: string, password?: string) {
        super()
        this.roomCode = code
        this.password = password
    }

    tryJoining(player: Player): Promise<Room> {
        throw new Error("Method not implemented.");
    }

    playerLeft(player:Player): void {
        throw new Error("Method not implemented.");
    }


}