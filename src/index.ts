import { httpServer } from "./http_server/index.js";
import { startWSS } from "./ws_server/server.js";


const HTTP_PORT = 8181;
const WS_PORT = 3000;

console.log(`Start static HTTP server on port ${HTTP_PORT}`);
httpServer.listen(HTTP_PORT);

console.log(`Start WebSocket server on port ${WS_PORT}`);
startWSS(WS_PORT);