import type { ClientMessage } from "../types/messages.js";

export const isClientMessage = (message: unknown): message is ClientMessage => {
  if (typeof message !== "object" || message === null) {
    return false;
  }

  const msg = message as Record<string, unknown>;

  if (typeof msg.type !== 'string' || typeof msg.id !== 'number') {
    return false
  }

  return true
};
