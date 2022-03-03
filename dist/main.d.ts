import VoskStreamWebSocketServer from "./websocket/server";
import VoskStreamWebSocketClient from "./websocket/client.web";
declare const VoskStream: {
    TCP: {};
    WebSocket: {
        Server: typeof VoskStreamWebSocketServer;
        Client: typeof VoskStreamWebSocketClient;
    };
};
export default VoskStream;
