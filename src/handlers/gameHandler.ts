import type { WebSocket } from "ws";
import type {
  AddShipsRequest,
  StartGameResponse,
  StringifiedDataMessage,
  TurnResponse,
} from "../types/messages.js";
import { gameService } from "../services/gameService.js";
import { connectionManager } from "../services/connectionManager.js";
import { stringifyData } from "../utils/stringifyData.js";

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
      const startGameMessage: StartGameResponse = {
        type: "start_game",
        data: {
          ships,
          currentPlayerIndex: pId,
        },
        id: 0,
      };
      const startGameMessageStr = stringifyData(startGameMessage);

      const turnMessage: TurnResponse = {
        type: "turn",
        data: {
          currentPlayer: game.currentTurn,
        },
        id: 0,
      };
      const turnMessageStr = stringifyData(turnMessage);

      connectionManager.sendToPlayer(pId, startGameMessageStr);
      connectionManager.sendToPlayer(pId, turnMessageStr);
    });
  }
};
