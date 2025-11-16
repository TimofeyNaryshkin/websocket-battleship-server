import type { ShipSize } from "./enums.js";

export interface RoomUser {
  name: string;
  index: number | string;
}

export interface RoomData {
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

export interface Player {
  name: string;
  password: string;
  index: number;
  wins: number;
}

export interface Game {
  gameId: number;
  playerIds: [number, number];
  ships: Map<number, Ship[]>;
  shipsReady: Set<number>
  currentTurn: number
}
