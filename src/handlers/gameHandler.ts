import type { WebSocket } from "ws";
import type {
  AddShipsRequest,
  StartGameResponse,
  StringifiedDataMessage,
} from "../types/messages.js";
import { gameService } from "../services/gameService.js";
import { connectionManager } from "../services/connectionManager.js";
import { roomService } from "../services/roomService.js";

export const handleAddShips = (ws: WebSocket, message: AddShipsRequest) => {
  const { gameId, ships, indexPlayer } = message.data;
  const playerId = connectionManager.getPlayerId(ws);
  const game = gameService.getGame(+gameId);
  if (playerId !== +indexPlayer || !game) return;

  gameService.addShips(+gameId, +indexPlayer, ships);

  if (gameService.areBothPlayersReady(+gameId)) {
    game.playerIds.forEach((pId) => {
      const ships = game.ships.get(pId);
      if (!ships) return;
      const responseMessage: StartGameResponse = {
        type: "start_game",
        data: {
          ships,
          currentPlayerIndex: pId,
        },
        id: 0,
      };
      const responseMessageStr: StringifiedDataMessage = {
        ...responseMessage,
        data: JSON.stringify(responseMessage.data),
      };
      connectionManager.sendToPlayer(pId, responseMessageStr);
    });
  }
};
