import VoskStreamWebSocketServer from "./websocket/server";
import VoskStreamWebSocketClient from "./websocket/client";

const vosk = require("vosk");

const VoskStream = {
    TCP: {

    },
    WebSocket: {
        Server: VoskStreamWebSocketServer,
        Client: VoskStreamWebSocketClient
    },

    setVoskLogLevel(level: number) {
        vosk.setLogLevel(level);
    }
}

export default VoskStream;