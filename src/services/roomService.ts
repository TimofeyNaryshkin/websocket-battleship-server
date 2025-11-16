import type { RoomData, RoomUser } from "../types/models.js";
import { playerService } from "./playerService.js";

class RoomService {
  private rooms = new Map<number, RoomData>();
  private nextRoomId = 1;

  createRoom(playerId: number) {
    const player = playerService.getPlayer(playerId);
    if (!player) return;

    const roomUser: RoomUser = {
      name: player.name,
      index: player.index,
    };

    const newRoom: RoomData = {
      roomId: this.nextRoomId++,
      roomUsers: [roomUser],
    };

    this.rooms.set(+newRoom.roomId, newRoom);

    return newRoom;
  }

  getAvailableRooms() {
    console.log(JSON.stringify(this.rooms
      .values()
      .toArray()
      .filter((r) => r.roomUsers.length === 1)))
    return this.rooms
      .values()
      .toArray()
      .filter((r) => r.roomUsers.length === 1);
  }
}

export const roomService = new RoomService();
