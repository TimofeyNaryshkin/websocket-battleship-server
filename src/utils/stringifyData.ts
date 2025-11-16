import type {
  ServerMessage,
  StringifiedDataMessage,
} from "../types/messages.js";

export const stringifyData = (
  message: ServerMessage
): StringifiedDataMessage => {
  return {
    ...message,
    data: JSON.stringify(message.data),
  };
};
