import type { WebSocket } from "ws";
import { connectionManager } from "../services/connectionManager.js";
import { roomService } from "../services/roomService.js";
import type {
  AddUserToRoomRequest,
  CreateGameResponse,
  CreateRoomRequest,
  StringifiedDataMessage,
} from "../types/messages.js";
import { playerService } from "../services/playerService.js";
import { gameService } from "../services/gameService.js";

export const handleCreateRoom = (ws: WebSocket) => {
  const playerId = connectionManager.getPlayerId(ws);

  if (!playerId) return;

  roomService.createRoom(playerId);

  connectionManager.broadcast({
    type: "update_room",
    data: JSON.stringify(roomService.getAvailableRooms()),
    id: 0,
  });

  connectionManager.broadcast({
    type: "update_winners",
    data: JSON.stringify(playerService.getWinners()),
    id: 0,
  });
};

export const handleAddUserToRoom = (
  ws: WebSocket,
  message: AddUserToRoomRequest
) => {
  const playerId = connectionManager.getPlayerId(ws);
  if (!playerId) return;

  const roomId = +message.data.indexRoom;
  const room = roomService.getRoom(roomId);

  roomService.addPlayerToRoom(roomId, playerId);
  if (roomService.isRoomFull(roomId)) {
    const playerIds = roomService.getPlayerIds(roomId);
    if (!playerIds) return;

    connectionManager.broadcast({
      type: "update_room",
      data: JSON.stringify(roomService.getAvailableRooms()),
      id: 0,
    });

    const game = gameService.createGame(playerIds);

    room?.roomUsers.forEach((u) => {
      const responseMessage: CreateGameResponse = {
        type: "create_game",
        data: {
          idGame: game.gameId,
          idPlayer: u.index,
        },
        id: 0,
      };
      const responseMessageStr: StringifiedDataMessage = {
        ...responseMessage,
        data: JSON.stringify(responseMessage.data),
      };
      connectionManager.sendToPlayer(+u.index, responseMessageStr);
    });
  }
};
