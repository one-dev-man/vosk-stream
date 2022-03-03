import VoskStreamWebSocketServer from "./websocket/server";
import VoskStreamWebSocketClient from "./websocket/client.web";


export default {
    TCP: {

    },
    WebSocket: {
        Server: VoskStreamWebSocketServer,
        Client: VoskStreamWebSocketClient
    }
}