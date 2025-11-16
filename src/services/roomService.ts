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
    return this.rooms
      .values()
      .toArray()
      .filter((r) => r.roomUsers.length === 1);
  }

  addPlayerToRoom(roomId: number, playerId: number) {
    const room = this.rooms.get(roomId);
    if (!room || room.roomUsers.length >= 2 || !!room.roomUsers.find(u => +u.index === playerId)) return;

    const player = playerService.getPlayer(playerId);
    if (!player) return;

    const roomUser: RoomUser = {
      name: player.name,
      index: player.index,
    };

    room.roomUsers.push(roomUser);
  }

  getRoom(roomId: number) {
    return this.rooms.get(roomId)
  }

  isRoomFull(roomId: number) {
    const room = this.rooms.get(roomId);
    return room ? room.roomUsers.length === 2 : false;
  }

  getPlayerIds(roomId: number): [number, number] | undefined {
    const room = this.rooms.get(roomId);
    if (!room || !room.roomUsers[0] || !room.roomUsers[1]) return;
    return [+room.roomUsers[0].index, +room.roomUsers[1].index];
  }
}

export const roomService = new RoomService();
