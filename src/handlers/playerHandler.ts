import type { WebSocket } from "ws";
import type {
  RegRequest,
  RegResponse,
  StringifiedDataMessage,
} from "../types/messages.js";
import { playerService } from "../services/playerService.js";
import { connectionManager } from "../services/connectionManager.js";
import { roomService } from "../services/roomService.js";

export const handlePlayerReg = (ws: WebSocket, message: RegRequest) => {
  const { name, password } = message.data;
  const player = playerService.register(name, password);

  connectionManager.addConnection(ws, player.index);

  const responseMessage: RegResponse = {
    type: "reg",
    data: {
      name: player.name,
      index: player.index,
      error: false,
      errorText: "",
    },
    id: 0,
  };

  const responseMessageStr: StringifiedDataMessage = {
    ...responseMessage,
    data: JSON.stringify(responseMessage.data),
  };

  connectionManager.sendToPlayer(player.index, responseMessageStr);

  connectionManager.broadcast({
    type: "update_room",
    data: JSON.stringify(roomService.getAvailableRooms()),
    id: 0,
  });

  connectionManager.broadcast({
    type: "update_winners",
    data: JSON.stringify(playerService.getWinners()),
    id: 0,
  });
};
