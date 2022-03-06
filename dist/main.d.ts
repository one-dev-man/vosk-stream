import VoskStreamWebSocketServer from "./websocket/server";
declare const VoskStream: {
    TCP: {};
    WebSocket: {
        Server: typeof VoskStreamWebSocketServer;
    };
    setVoskLogLevel(level: number): void;
};
export default VoskStream;
