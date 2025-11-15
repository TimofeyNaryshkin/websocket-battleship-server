import type { ShipSize } from "./enums.js";

export interface RoomUser {
  name: string;
  index: number | string;
}

export interface UpdateRoomData {
  roomId: number | string;
  roomUsers: RoomUser[];
}

export interface Ship {
  position: {
    x: number;
    y: number;
  };
  direction: boolean;
  length: number;
  type: ShipSize;
}
