"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _VoskStreamTCPServer_socket_server;
Object.defineProperty(exports, "__esModule", { value: true });
const net = require("net");
class VoskStreamTCPServer {
    constructor() {
        _VoskStreamTCPServer_socket_server.set(this, void 0);
        __classPrivateFieldSet(this, _VoskStreamTCPServer_socket_server, net.createServer((socket) => {
        }), "f");
    }
}
_VoskStreamTCPServer_socket_server = new WeakMap();
//# sourceMappingURL=server.js.map