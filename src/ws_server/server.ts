import { WebSocketServer } from "ws";
import { messageHandler } from "../handlers/messageHandler.js";
import {
  isClientMessage,
  isStringifiedDataMessage,
} from "../utils/typeGuards.js";
import { connectionManager } from "../services/connectionManager.js";

export const startWSS = (port: number) => {
  const wss = new WebSocketServer({ port });

  wss.on("connection", (ws) => {
    ws.on("message", (data) => {
      try {
        const parsedRequest: unknown = JSON.parse(data.toString());
        if (!isStringifiedDataMessage(parsedRequest)) {
          console.error("Invalid data format:", parsedRequest);
          return;
        }
        console.log('request:', parsedRequest);
        const parsedData: unknown = parsedRequest.data.length
          ? {
              ...parsedRequest,
              data: JSON.parse(parsedRequest.data),
            }
          : parsedRequest;
        if (!isClientMessage(parsedData)) {
          console.error("Invalid message format:", parsedData);
          return;
        }

        messageHandler(ws, parsedData);
      } catch (error) {
        console.error("Invalid message:", error);
      }
    });

    ws.on("close", () => {
      connectionManager.removeConnection(ws);
      console.log("Client disconnected");
    });
  });

  return wss;
};
