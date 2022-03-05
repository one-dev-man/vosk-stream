"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _VoskStreamTCPServerClient_socket, _VoskStreamTCPServerClient_closed, _VoskStreamTCPServerClient_init, _VoskStreamTCPServer_socket_server, _VoskStreamTCPServer_clients;
Object.defineProperty(exports, "__esModule", { value: true });
const EventEmitter = require("events");
const net = require("net");
const datatypes_1 = __importDefault(require("./datatypes"));
class VoskStreamTCPServerClient extends EventEmitter {
    constructor(socket) {
        super();
        //
        _VoskStreamTCPServerClient_socket.set(this, void 0);
        _VoskStreamTCPServerClient_closed.set(this, false);
        //
        _VoskStreamTCPServerClient_init.set(this, () => {
            let data = Buffer.from([]);
            let data_type_id = null;
            let data_length = -1;
            this.socket.on("data", (d) => {
                if (!(data.length < data_length)) {
                    if (data_length > 0) {
                        this.emit("data", data);
                        let data_type = datatypes_1.default.getById(data_type_id);
                        if (data_type) {
                            try {
                                this.emit(data_type.event, data_type.parse(data));
                            }
                            catch (e) {
                                console.error(e);
                            }
                        }
                    }
                    data_type_id = d.readUInt8(0);
                    data_length = d.readUInt32BE(1);
                    data = d.slice(5);
                }
                if (data.length < data_length) {
                    data = Buffer.concat([data, d]);
                }
            });
            this.socket.on("close", () => {
                __classPrivateFieldSet(this, _VoskStreamTCPServerClient_closed, true, "f");
                this.emit("close");
            });
        }
        //
        );
        __classPrivateFieldSet(this, _VoskStreamTCPServerClient_socket, socket, "f");
        __classPrivateFieldGet(this, _VoskStreamTCPServerClient_init, "f").call(this);
    }
    //
    get socket() { return __classPrivateFieldGet(this, _VoskStreamTCPServerClient_socket, "f"); }
    get closed() { return __classPrivateFieldGet(this, _VoskStreamTCPServerClient_closed, "f"); }
    //
    on(event, callback) { return super.on(event, callback); }
    once(event, callback) { return super.once(event, callback); }
    removeListener(event, callback) { return super.removeListener(event, callback); }
    removeAllListeners(event) { return super.removeAllListeners(event); }
    off(event, callback) { return super.off(event, callback); }
    emit(event, ...args) { return super.emit(event, ...args); }
}
_VoskStreamTCPServerClient_socket = new WeakMap(), _VoskStreamTCPServerClient_closed = new WeakMap(), _VoskStreamTCPServerClient_init = new WeakMap();
class VoskStreamTCPServer {
    constructor() {
        _VoskStreamTCPServer_socket_server.set(this, void 0);
        _VoskStreamTCPServer_clients.set(this, new Array());
        __classPrivateFieldSet(this, _VoskStreamTCPServer_socket_server, net.createServer((socket) => {
            let client = new VoskStreamTCPServerClient(socket);
            __classPrivateFieldGet(this, _VoskStreamTCPServer_clients, "f").push(client);
            client.on("string", r => console.log(r));
        }), "f");
    }
}
_VoskStreamTCPServer_socket_server = new WeakMap(), _VoskStreamTCPServer_clients = new WeakMap();
//# sourceMappingURL=server.js.map