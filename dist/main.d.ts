import VoskStreamWebSocketServer from "./websocket/server";
import VoskStreamWebSocketClient from "./websocket/client";
declare const VoskStream: {
    TCP: {};
    WebSocket: {
        Server: typeof VoskStreamWebSocketServer;
        Client: typeof VoskStreamWebSocketClient;
    };
    setVoskLogLevel(level: number): void;
};
export default VoskStream;
