import { AttackStatus, type Board } from "../types/enums.js";
import type { Coordinates, Game, Ship } from "../types/models.js";
import { playerService } from "./playerService.js";

class GameService {
  private games = new Map<number, Game>();
  private nextGameId = 1;

  createGame(playerIds: [number, number]) {
    const newGame: Game = {
      gameId: this.nextGameId++,
      playerIds,
      ships: new Map(),
      boards: new Map(),
      shipsReady: new Set(),
      currentTurn: playerIds[0],
    };

    this.games.set(newGame.gameId, newGame);
    return newGame;
  }

  addShips(gameId: number, playerId: number, ships: Ship[]) {
    const game = this.games.get(gameId);
    if (!game) return;

    game.ships.set(playerId, ships);
    game.shipsReady.add(playerId);

    game.boards.set(playerId, this.createEmptyBoard())
  }

  areBothPlayersReady(gameId: number) {
    const game = this.games.get(gameId);
    return game ? game.shipsReady.size === 2 : false;
  }

  getGame(gameId: number) {
    return this.games.get(gameId);
  }

  attack(gameId: number, x: number, y: number, playerId: number) {
    const game = this.games.get(gameId);
    if (!game) return;

    if (game.currentTurn !== playerId) return;

    const enemyId = game.playerIds.find((pId) => pId !== playerId);
    if (!enemyId) return;
    const enemyShips = game.ships.get(enemyId);
    const enemyBoard = game.boards.get(enemyId);
    if (!enemyShips || !enemyBoard) return;
    if (!enemyBoard[y]) return;
    if (enemyBoard[y][x] !== "empty") {
      console.error(
        playerService.getPlayer(playerId)?.name,
        " already attacked this cell"
      );
    }

    const hitShip = this.checkHit(x, y, enemyShips);

    if (!hitShip) {
      enemyBoard[y][x] = "miss";
      game.currentTurn = enemyId;

      return {
        status: AttackStatus.Miss,
        nextTurn: enemyId,
      };
    }

    enemyBoard[y][x] = "hit";
    const isKilled = this.checkKilled(hitShip, enemyBoard);

    if (isKilled) {
      const surroundingCells = this.getSurroundingCells(hitShip);
      surroundingCells.forEach((cell) => {
        if (!cell) return;
        const { x: sx, y: sy } = cell;

        if (enemyBoard[sy] && enemyBoard[sy][sx] === "empty") {
          enemyBoard[sy][sx] = "miss";
        }
      });

      const allShipsKilled = this.checkAllShipsKilled(enemyShips, enemyBoard);

      if (allShipsKilled) {
        return {
          status: AttackStatus.Killed,
          nextTurn: playerId,
          winner: playerId,
          killedShip: hitShip,
        };
      }

      return {
        status: AttackStatus.Killed,
        nextTurn: playerId,
        killedShip: hitShip,
        surroundingCells
      };
    }

    return {
      status: AttackStatus.Shot,
      nextTurn: playerId,
    };
  }

  private getShipCells(ship: Ship) {
    const cells: Coordinates[] = [];
    for (let i = 0; i < ship.length; i++) {
      if (ship.direction) {
        cells.push({
          x: ship.position.x,
          y: ship.position.y + i,
        });
      } else {
        cells.push({
          y: ship.position.y,
          x: ship.position.x + i,
        });
      }
    }
    return cells;
  }

  private checkHit(x: number, y: number, ships: Ship[]) {
    for (const ship of ships) {
      const cells = this.getShipCells(ship);

      if (cells.some((cell) => cell.x === x && cell.y === y)) {
        return ship;
      }
    }
    return null;
  }

  private checkKilled(ship: Ship, board: Board) {
    const cells = this.getShipCells(ship);

    return cells.every((cell) => board[cell.y]?.[cell.x] === "hit");
  }

  private getSurroundingCells(ship: Ship) {
    const cells = this.getShipCells(ship);
    const surrounding = new Set<string>();

    cells.forEach((cell) => {
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (dx === 0 && dy === 0) continue;

          const nx = cell.x + dx;
          const ny = cell.y + dy;

          if (nx > 0 && nx < 10 && ny > 0 && ny < 10) {
            const isShipCell = cells.some((sc) => sc.x === nx && sc.y === ny);
            if (!isShipCell) {
              surrounding.add(`${nx},${ny}`);
            }
          }
        }
      }
    });

    return surrounding
      .values()
      .toArray()
      .map((v) => {
        const parts = v.split(",");
        if (!parts[0] || !parts[1]) return;
        const x = parseInt(parts[0], 10);
        const y = parseInt(parts[1], 10);
        return { x, y };
      });
  }

  private checkAllShipsKilled(ships: Ship[], board: Board) {
    return ships.every((s) => this.checkKilled(s, board));
  }

  private createEmptyBoard() {
    return Array(10)
      .fill(null)
      .map(() => Array(10).fill("empty"));
  }
}

export const gameService = new GameService();
