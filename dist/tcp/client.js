"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _VoskStreamTCPClient_socket, _VoskStreamTCPClient_send;
Object.defineProperty(exports, "__esModule", { value: true });
const net = require("net");
const datatypes_1 = __importDefault(require("./datatypes"));
class VoskStreamTCPClient {
    constructor() {
        _VoskStreamTCPClient_socket.set(this, null);
        //
        _VoskStreamTCPClient_send.set(this, (data) => {
            let data_type = datatypes_1.default.getByInput(data);
            this.socket?.write(data_type?.pack(data));
        });
    }
    //
    get socket() { return __classPrivateFieldGet(this, _VoskStreamTCPClient_socket, "f"); }
    //
    connect(options) {
        __classPrivateFieldSet(this, _VoskStreamTCPClient_socket, net.connect(options.port, options.ip), "f");
        this.socket?.on("data", (d) => {
        });
    }
}
_VoskStreamTCPClient_socket = new WeakMap(), _VoskStreamTCPClient_send = new WeakMap();
//# sourceMappingURL=client.js.map