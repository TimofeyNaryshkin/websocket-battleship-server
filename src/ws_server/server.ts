import { WebSocketServer } from "ws";
import { messageHandler } from "../handlers/messageHandler.js";
import { isClientMessage } from "../utils/typeGuards.js";

export const startWSS = (port: number) => {
  const wss = new WebSocketServer({ port });

  wss.on("connection", (ws) => {
    ws.on("message", (data) => {
      try {
        const parsedData: unknown = JSON.parse(data.toString());

        if (!isClientMessage(parsedData)) {
          console.error("Invalid message format:", parsedData);
          return
        }

        messageHandler(parsedData);
      } catch (error) {
        console.error("Invalid message:", error);
      }
    });

  });

  return wss;
};
