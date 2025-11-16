import type { WebSocket } from "ws";
import type { ClientMessage } from "../types/messages.js";
import { handlePlayerReg } from "./playerHandler.js";
import { handleAddUserToRoom, handleCreateRoom } from "./roomHander.js";
import { handleAddShips } from "./gameHandler.js";

export const messageHandler = (ws: WebSocket, message: ClientMessage) => {
  switch (message.type) {
    case "reg":
      handlePlayerReg(ws, message);
      break;
    case "create_room":
      handleCreateRoom(ws);
      break;
    case "add_user_to_room":
      handleAddUserToRoom(ws, message);
      break;
    case 'add_ships':
      handleAddShips(ws, message);
      break;

    default:
      break;
  }
};
