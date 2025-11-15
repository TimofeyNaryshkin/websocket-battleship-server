import type { WebSocket } from "ws";
import type { ClientMessage } from "../types/messages.js";
import { handlePlayerReg } from "./playerHandler.js";

export const messageHandler = (ws: WebSocket, message: ClientMessage) => {
  switch (message.type) {
    case "reg":
      handlePlayerReg(ws, message)
      break;

    default:
      break;
  }
};
