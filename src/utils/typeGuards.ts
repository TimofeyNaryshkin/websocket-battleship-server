import type {
  ClientMessage,
  StringifiedDataMessage,
} from "../types/messages.js";

export const isClientMessage = (
  message: unknown
): message is ClientMessage => {

  const msg = message as Record<string, unknown>;
  
  switch (msg.type) {
    case "reg":
      return true;
    case "create_room":
      return true;
    case "add_user_to_room":
      return true;
    case "add_ships":
      return true;
    case "attack":
      return true;
    case "randomAttack":
      return true;
    default:
      return false;
  }
};

export const isStringifiedDataMessage = (
  message: unknown
): message is StringifiedDataMessage => {
  if (typeof message !== "object" || message === null) {
    return false;
  }

  const msg = message as Record<string, unknown>;

  if (typeof msg.type !== "string" || typeof msg.id !== "number") {
    return false;
  }

  if (typeof msg.data !== "string") {
    return false;
  }

  return true;
};
