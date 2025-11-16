import type { Game, Ship } from "../types/models.js";

class GameService {
  private games = new Map<number, Game>();
  private nextGameId = 1;

  createGame(playerIds: [number, number]) {
    const newGame: Game = {
      gameId: this.nextGameId++,
      playerIds,
      ships: new Map(),
      shipsReady: new Set(),
    };

    this.games.set(newGame.gameId, newGame);
    return newGame;
  }

  addShips(gameId: number, playerId: number, ships: Ship[]) {
    const game = this.games.get(gameId);
    if (!game) return;

    game.ships.set(playerId, ships);
    game.shipsReady.add(playerId);
  }

  areBothPlayersReady(gameId: number) {
    const game = this.games.get(gameId);
    return game ? game.shipsReady.size === 2 : false;
  }

  getGame(gameId: number) {
    return this.games.get(gameId)
  }
}

export const gameService = new GameService();
