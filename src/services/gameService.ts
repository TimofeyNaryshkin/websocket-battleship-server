import type { Game } from "../types/models.js";

class GameService {
  private games = new Map<number, Game>
  private nextGameId = 1

  createGame(playerIds: [number, number]) {
    const newGame: Game = {
      gameId: this.nextGameId++,
      playerIds
    }

    this.games.set(newGame.gameId, newGame)
    return newGame
  }
}

export const gameService = new GameService()