import type { Player } from "../types/models.js";

class PlayerService {
  private players = new Map<number, Player>();
  private playersByName = new Map<string, Player>();
  private nextPlayerId = 1;

  register(name: string, password: string) {
    const existingPlayer = this.playersByName.get(name);
    if (existingPlayer) {
      if (existingPlayer.password === password) {
        return existingPlayer;
      } else {
        throw new Error("Invalid name or password");
      }
    }

    const newPlayer: Player = {
      name,
      password,
      index: this.nextPlayerId++,
      wins: 0,
    };
    this.players.set(newPlayer.index, newPlayer);
    this.playersByName.set(name, newPlayer);

    console.log("new player:", JSON.stringify(newPlayer));
    return newPlayer;
  }

  getPlayer(playerId: number) {
    return this.players.get(playerId);
  }

  addWin(playerId: number) {
    const player = this.players.get(playerId);
    if (player) {
      player.wins++;
    }
  }

  getWinners() {
    return this.players
      .values()
      .toArray()
      .sort((a, b) => b.wins - a.wins)
      .map((p) => ({ name: p.name, wins: p.wins }));
  }
}

export const playerService = new PlayerService();
