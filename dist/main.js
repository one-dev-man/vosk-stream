"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("./websocket/server"));
const client_1 = __importDefault(require("./websocket/client"));
const VoskStream = {
    TCP: {},
    WebSocket: {
        Server: server_1.default,
        Client: client_1.default
    }
};
exports.default = VoskStream;
//# sourceMappingURL=main.js.map