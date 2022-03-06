"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("./websocket/server"));
// import VoskStreamWebSocketClient from "./websocket/client";
const vosk = require("vosk");
const VoskStream = {
    TCP: {},
    WebSocket: {
        Server: server_1.default,
    },
    setVoskLogLevel(level) {
        vosk.setLogLevel(level);
    }
};
exports.default = VoskStream;
//# sourceMappingURL=main.js.map