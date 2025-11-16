import type { WebSocket } from "ws";
import { connectionManager } from "../services/connectionManager.js";
import { roomService } from "../services/roomService.js";
import type { CreateRoomRequest } from "../types/messages.js";

export const handleCreateRoom = (ws: WebSocket, message: CreateRoomRequest) => {
  const playerId = connectionManager.getPlayerId(ws)

  if (!playerId) return

  roomService.createRoom(playerId);

  connectionManager.broadcast({
    type: "update_room",
    data: JSON.stringify(roomService.getAvailableRooms()),
    id: 0,
  });
};
