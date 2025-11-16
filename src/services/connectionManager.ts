import type { WebSocket } from "ws";
import type { ServerMessage, ServerMessageStr } from "../types/messages.js";

class ConnectionManager {
  private connections = new Map<WebSocket, number>();
  private players = new Map<number, WebSocket>();

  addConnection(ws: WebSocket, playerId: number) {
    this.connections.set(ws, playerId);
    this.players.set(playerId, ws);
  }

  removeConnection(ws: WebSocket) {
    const playerId = this.connections.get(ws);
    if (playerId) {
      this.players.delete(playerId);
    }
    this.connections.delete(ws);
  }

  getPlayerId(ws: WebSocket) {
    return this.connections.get(ws);
  }

  getPlayerSocket(playerId: number) {
    return this.players.get(playerId);
  }

  sendToPlayer(playerId: number, message: ServerMessageStr) {
    const ws = this.players.get(playerId);
    if (ws && ws.readyState === ws.OPEN) {
      ws.send(JSON.stringify(message));
    }
  }

  sendToRoom(playerIds: [number, number], message: ServerMessageStr) {
    playerIds.forEach((id) => this.sendToPlayer(id, message));
  }

  broadcast(message: ServerMessageStr) {
    this.players.forEach((ws) => {
      if (ws.readyState === ws.OPEN) {
        ws.send(JSON.stringify(message));
      }
    });
  }
}

export const connectionManager = new ConnectionManager()
