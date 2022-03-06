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
var _VoskStreamWebSocketServer_loaded_modelpath, _VoskStreamWebSocketServer_httpServer, _VoskStreamWebSocketServer_wss, _VoskStreamWebSocketServer_socket_filter, _VoskStreamWebSocketServer_closed;
Object.defineProperty(exports, "__esModule", { value: true });
const EventEmitter = require("events");
const WebSocket = require("ws");
const transcriber_1 = __importDefault(require("../stt/transcriber"));
class VoskStreamWebSocketServer extends EventEmitter {
    constructor(options) {
        super();
        _VoskStreamWebSocketServer_loaded_modelpath.set(this, {});
        _VoskStreamWebSocketServer_httpServer.set(this, void 0);
        _VoskStreamWebSocketServer_wss.set(this, null);
        _VoskStreamWebSocketServer_socket_filter.set(this, async (socket) => { return true; });
        _VoskStreamWebSocketServer_closed.set(this, true);
        __classPrivateFieldSet(this, _VoskStreamWebSocketServer_httpServer, options.httpServer, "f");
    }
    //
    get httpServer() { return __classPrivateFieldGet(this, _VoskStreamWebSocketServer_httpServer, "f"); }
    get wss() { return __classPrivateFieldGet(this, _VoskStreamWebSocketServer_wss, "f"); }
    get closed() { return __classPrivateFieldGet(this, _VoskStreamWebSocketServer_closed, "f"); }
    //
    on(event, callback) { return super.on(event, callback); }
    once(event, callback) { return super.once(event, callback); }
    removeListener(event, callback) { return super.removeListener(event, callback); }
    removeAllListeners(event) { return super.removeAllListeners(event); }
    off(event, callback) { return super.off(event, callback); }
    emit(event, ...args) { return super.emit(event, ...args); }
    //
    open() {
        if (this.closed) {
            __classPrivateFieldSet(this, _VoskStreamWebSocketServer_wss, new WebSocket.Server({
                server: this.httpServer
            }), "f");
            __classPrivateFieldGet(this, _VoskStreamWebSocketServer_wss, "f").on("connection", async (socket) => {
                if (await __classPrivateFieldGet(this, _VoskStreamWebSocketServer_socket_filter, "f").call(this, socket)) {
                    let transcriber = null;
                    socket;
                    let transcription_callback = null;
                    let old_transcription_memory = [null];
                    socket.on("message", async (data, isBinary) => {
                        if (!isBinary) {
                            let request = JSON.parse(data.toString("utf-8"));
                            let response = {};
                            this.emit((request.event || ""), socket, request.content);
                            if (request.content.command == "set_model") {
                                let modelpath = __classPrivateFieldGet(this, _VoskStreamWebSocketServer_loaded_modelpath, "f")[request.content.model];
                                if (modelpath) {
                                    await transcriber?.stop();
                                    transcription_callback ? transcriber?.removeListener("transcription", transcription_callback) : null;
                                    transcriber = new transcriber_1.default({ modelpath: modelpath });
                                    !transcriber?.active ? await transcriber?.start() : null;
                                    transcription_callback = getTranscriptionCallback(socket, response, old_transcription_memory);
                                    transcriber?.on("transcription", transcription_callback);
                                    response.event = request.event;
                                    response.content = { model: request.content.model };
                                }
                            }
                            else if (request.content.command == "get_models") {
                                response.event = request.event;
                                response.content = { models: Object.keys(__classPrivateFieldGet(this, _VoskStreamWebSocketServer_loaded_modelpath, "f")) };
                            }
                            socket.send(JSON.stringify(response));
                        }
                        else {
                            transcriber?.transcribe(Buffer.from(data));
                        }
                    });
                }
            });
            __classPrivateFieldSet(this, _VoskStreamWebSocketServer_closed, false, "f");
            this.emit("open");
        }
    }
    close() {
        __classPrivateFieldGet(this, _VoskStreamWebSocketServer_wss, "f")?.close();
        __classPrivateFieldSet(this, _VoskStreamWebSocketServer_wss, null, "f");
        __classPrivateFieldSet(this, _VoskStreamWebSocketServer_closed, true, "f");
        this.emit("close");
    }
    //
    setClientFilter(cb) {
        cb instanceof Function ? __classPrivateFieldSet(this, _VoskStreamWebSocketServer_socket_filter, cb, "f") : null;
    }
    //
    async loadModel(label, modelpath) {
        __classPrivateFieldGet(this, _VoskStreamWebSocketServer_loaded_modelpath, "f")[label] = modelpath;
        await transcriber_1.default.VOSK_MODELS.get(__classPrivateFieldGet(this, _VoskStreamWebSocketServer_loaded_modelpath, "f")[label]);
    }
    async unloadModel(label) {
        (await transcriber_1.default.VOSK_MODELS.get(__classPrivateFieldGet(this, _VoskStreamWebSocketServer_loaded_modelpath, "f")[label])).free();
        delete __classPrivateFieldGet(this, _VoskStreamWebSocketServer_loaded_modelpath, "f")[label];
    }
}
exports.default = VoskStreamWebSocketServer;
_VoskStreamWebSocketServer_loaded_modelpath = new WeakMap(), _VoskStreamWebSocketServer_httpServer = new WeakMap(), _VoskStreamWebSocketServer_wss = new WeakMap(), _VoskStreamWebSocketServer_socket_filter = new WeakMap(), _VoskStreamWebSocketServer_closed = new WeakMap();
function getTranscriptionCallback(socket, response, old_transcription_memory) {
    let cb = (transcription) => {
        if ((transcription.partial != old_transcription_memory[0]?.partial
            || transcription.content != old_transcription_memory[0]?.content)
            &&
                (!transcription.partial || transcription.content.length > 0)) {
            response.event = "transcription";
            response.content = transcription;
            socket.send(JSON.stringify(response));
            old_transcription_memory[0] = transcription;
        }
    };
    return cb;
}
//# sourceMappingURL=server.js.map