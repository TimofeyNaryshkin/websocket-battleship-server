import type { Room } from "../types/models.js";

class RoomService {
  private rooms = new Map<number, Room>();
  private nextRoomId = 1;

  createRoom(playerId: number) {
    const newRoom: Room = {
      roomId: this.nextRoomId++,
      playerIds: [playerId],
    };

    this.rooms.set(newRoom.roomId, newRoom);
    return newRoom;
  }

  getAvailableRooms() {
    return this.rooms
      .values()
      .toArray()
      .filter((r) => r.playerIds.length === 1);
  }
}

export const roomService = new RoomService()
