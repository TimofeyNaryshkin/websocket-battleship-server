import type { WebSocket } from "ws";
import type {
  AddShipsRequest,
  AttackRequest,
  AttackResponse,
  FinishResponse,
  StartGameResponse,
  TurnResponse,
} from "../types/messages.js";
import { gameService } from "../services/gameService.js";
import { connectionManager } from "../services/connectionManager.js";
import { stringifyData } from "../utils/stringifyData.js";
import { playerService } from "../services/playerService.js";
import { AttackStatus } from "../types/enums.js";
import { console } from "inspector";

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

export const handleAttack = (ws: WebSocket, message: AttackRequest) => {
  const { gameId, x, y } = message.data;
  const playerId = connectionManager.getPlayerId(ws);
  const game = gameService.getGame(+gameId);
  if (!playerId || !game) return;

  const result = gameService.attack(+gameId, x, y, playerId);
  if (!result) return;

  const attackMessage: AttackResponse = {
    type: "attack",
    data: {
      position: { x, y },
      currentPlayer: playerId,
      status: result.status,
    },
    id: 0,
  };
  const attackMessageStr = stringifyData(attackMessage);
  connectionManager.sendToRoom(game.playerIds, attackMessageStr);

  if (
    result.status === AttackStatus.Killed &&
    result.killedShip &&
    result.surroundingCells
  ) {
    result.surroundingCells.forEach((cell) => {
      if (!cell) return;
      const attackMessage: AttackResponse = {
        type: "attack",
        data: {
          position: cell,
          currentPlayer: playerId,
          status: AttackStatus.Miss,
        },
        id: 0,
      };
      const attackMessageStr = stringifyData(attackMessage);

      connectionManager.sendToRoom(game.playerIds, attackMessageStr);
    });
  }

  const turnMessage: TurnResponse = {
    type: "turn",
    data: {
      currentPlayer: result.nextTurn,
    },
    id: 0,
  };
  const turnMessageStr = stringifyData(turnMessage);
  connectionManager.sendToRoom(game.playerIds, turnMessageStr);

  if (result.winner) {
    const winMessage: FinishResponse = {
      type: "finish",
      data: {
        winPlayer: result.winner,
      },
      id: 0,
    };
    const winMessageStr = stringifyData(winMessage);
    connectionManager.sendToRoom(game.playerIds, winMessageStr);

    playerService.addWin(result.winner);

    connectionManager.broadcast({
      type: "update_winners",
      data: JSON.stringify(playerService.getWinners()),
      id: 0,
    });
  }
};
