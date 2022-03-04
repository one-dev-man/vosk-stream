/// <reference types="node" />
import EventEmitter = require("events");
import * as http from "http";
import WebSocket = require("websocket");
declare type VOSKSTREAM_WEBSOCKET_SERVER_EVENTS = "open" | "close" | "error";
export default class VoskStreamWebSocketServer extends EventEmitter {
    #private;
    constructor(options: {
        httpServer: http.Server;
    });
    get httpServer(): http.Server;
    get wss(): WebSocket.server | null;
    get closed(): boolean;
    on(event: VOSKSTREAM_WEBSOCKET_SERVER_EVENTS, callback: (...args: any[]) => void): this;
    once(event: VOSKSTREAM_WEBSOCKET_SERVER_EVENTS, callback: (...args: any[]) => void): this;
    removeListener(event: VOSKSTREAM_WEBSOCKET_SERVER_EVENTS, callback: (...args: any[]) => void): this;
    removeAllListeners(event: VOSKSTREAM_WEBSOCKET_SERVER_EVENTS): this;
    off(event: VOSKSTREAM_WEBSOCKET_SERVER_EVENTS, callback: (...args: any[]) => void): this;
    emit(event: VOSKSTREAM_WEBSOCKET_SERVER_EVENTS, ...args: any): boolean;
    open(): void;
    close(): void;
    setRequestFilter(cb: (request: WebSocket.request) => Promise<boolean>): void;
    loadModel(label: string, modelpath: string): Promise<void>;
    unloadModel(label: string): void;
}
export {};
