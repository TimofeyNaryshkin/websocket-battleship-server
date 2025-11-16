import { WebSocketServer } from "ws";
import { messageHandler } from "../handlers/messageHandler.js";
import {
  isClientMessage,
  isStringifiedDataMessage,
} from "../utils/typeGuards.js";
import { connectionManager } from "../services/connectionManager.js";

export const startWSS = (port: number) => {
  const wss = new WebSocketServer({ port });

  console.log("=".repeat(50));
  console.log("WebSocket Server Started");
  console.log("=".repeat(50));
  console.log(`Host: localhost`);
  console.log(`Port: ${port}`);
  console.log(`URL: ws://localhost:${port}`);
  console.log("=".repeat(50));

  wss.on("connection", (ws, req) => {
    const clientIp = req.socket.remoteAddress;
    console.log(`[CONNECTION] New client connected from ${clientIp}`);

    ws.on("message", (data) => {
      try {
        const parsedRequest: unknown = JSON.parse(data.toString());
        if (!isStringifiedDataMessage(parsedRequest)) {
          console.error("[ERROR] Invalid data format:", parsedRequest);
          return;
        }

        console.log("\n" + "-".repeat(50));
        console.log(`[COMMAND RECEIVED] Type: ${parsedRequest.type}`);
        console.log(`[RAW DATA]`, parsedRequest);

        const parsedData: unknown = parsedRequest.data.length
          ? {
              ...parsedRequest,
              data: JSON.parse(parsedRequest.data),
            }
          : parsedRequest;
        if (!isClientMessage(parsedData)) {
          console.error("[ERROR] Invalid message format:", parsedData);
          console.log("-".repeat(50) + "\n");
          return;
        }

        const result = messageHandler(ws, parsedData);

        console.log(
          `[RESULT] Command '${parsedData.type}' processed successfully`
        );
        console.log("-".repeat(50) + "\n");
      } catch (error) {
        console.error("[ERROR] Message processing failed:", error);
        if (error instanceof Error) {
          console.error("[ERROR DETAILS]", error.message);
        }
        console.log("-".repeat(50) + "\n");
      }
    });

    ws.on("close", () => {
      connectionManager.removeConnection(ws);
      console.log(`[DISCONNECT] Client ${clientIp} disconnected`);
    });

    ws.on("error", (error) => {
      console.error("[WS ERROR]", error);
    });
  });

  const shutdown = () => {
    console.log("\n" + "=".repeat(50));
    console.log("Shutting down WebSocket server...");

    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.close(1000, "Server shutting down");
      }
    });

    wss.close(() => {
      console.log("WebSocket server closed successfully");
      console.log("=".repeat(50));
      process.exit(0);
    });

    setTimeout(() => {
      console.error("Force closing WebSocket server");
      process.exit(1);
    }, 5000);
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);

  return wss;
};
