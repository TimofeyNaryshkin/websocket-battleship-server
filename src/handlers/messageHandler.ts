import type { WebSocket } from "ws";
import type { ClientMessage } from "../types/messages.js";
import { handlePlayerReg } from "./playerHandler.js";
import { handleAddUserToRoom, handleCreateRoom } from "./roomHander.js";
import {
  handleAddShips,
  handleAttack,
  handleRandomAttack,
} from "./gameHandler.js";

export const messageHandler = (ws: WebSocket, message: ClientMessage) => {
  switch (message.type) {
    case "reg":
      handlePlayerReg(ws, message);
      return `Player registration processed`;
    case "create_room":
      handleCreateRoom(ws);
      return `Room created`;
    case "add_user_to_room":
      handleAddUserToRoom(ws, message);
      return `Player added to room`;
    case "add_ships":
      handleAddShips(ws, message);
      return `Ships added to game`;
    case "attack":
      handleAttack(ws, message);
      return `Attack processed`;
    case "randomAttack":
      handleRandomAttack(ws, message);
      return `Random attack processed`;
    default:
      console.error("[ERROR] Unknown message type:", (message as ClientMessage).type);
      break;
  }
};
