import { WebSocketServer } from "ws";

const port = 3000;
const wss = new WebSocketServer({ port });

console.log(wss)

wss.on('connection', (ws) => {
  ws.on('message', (data) => {})
})
