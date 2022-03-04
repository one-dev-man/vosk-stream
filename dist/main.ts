import VoskStreamWebSocketServer from "./websocket/server";
import VoskStreamWebSocketClient from "./websocket/client";


const VoskStream = {
    TCP: {

    },
    WebSocket: {
        Server: VoskStreamWebSocketServer,
        Client: VoskStreamWebSocketClient
    }
}

export default VoskStream;