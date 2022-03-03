/// <reference types="node" />
import * as http from "http";
import WebSocket = require("websocket");
export default class VoskStreamWebSocketServer {
    #private;
    constructor(options: {
        httpServer: http.Server;
    });
    get httpServer(): http.Server;
    get wss(): WebSocket.server | null;
    get closed(): boolean;
    open(): void;
    setRequestFilter(cb: (request: WebSocket.request) => Promise<boolean>): void;
    loadModel(label: string, modelpath: string): Promise<void>;
    unloadModel(label: string): void;
    close(): void;
}
