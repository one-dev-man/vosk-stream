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
var _VoskStreamWebSocketServer_loaded_modelpath, _VoskStreamWebSocketServer_httpServer, _VoskStreamWebSocketServer_wss, _VoskStreamWebSocketServer_request_filter, _VoskStreamWebSocketServer_closed;
Object.defineProperty(exports, "__esModule", { value: true });
const WebSocket = require("websocket");
const transcriber_1 = __importDefault(require("../stt/transcriber"));
class VoskStreamWebSocketServer {
    constructor(options) {
        _VoskStreamWebSocketServer_loaded_modelpath.set(this, {});
        _VoskStreamWebSocketServer_httpServer.set(this, void 0);
        _VoskStreamWebSocketServer_wss.set(this, null);
        _VoskStreamWebSocketServer_request_filter.set(this, async (request) => { return true; });
        _VoskStreamWebSocketServer_closed.set(this, true);
        __classPrivateFieldSet(this, _VoskStreamWebSocketServer_httpServer, options.httpServer, "f");
    }
    //
    get httpServer() { return __classPrivateFieldGet(this, _VoskStreamWebSocketServer_httpServer, "f"); }
    get wss() { return __classPrivateFieldGet(this, _VoskStreamWebSocketServer_wss, "f"); }
    get closed() { return __classPrivateFieldGet(this, _VoskStreamWebSocketServer_closed, "f"); }
    //
    open() {
        if (this.closed) {
            __classPrivateFieldSet(this, _VoskStreamWebSocketServer_wss, new WebSocket.server({
                httpServer: this.httpServer
            }), "f");
            __classPrivateFieldGet(this, _VoskStreamWebSocketServer_wss, "f").on("request", async (request) => {
                if (await __classPrivateFieldGet(this, _VoskStreamWebSocketServer_request_filter, "f").call(this, request)) {
                    let transcriber = null;
                    let socket = request.accept();
                    let transcription_callback = null;
                    let old_transcription_memory = [null];
                    socket.on("message", async (message) => {
                        if (message.type == "utf8") {
                            let transcription_request_info = JSON.parse(message.utf8Data);
                            if (typeof transcription_request_info.model == "string") {
                                let modelpath = __classPrivateFieldGet(this, _VoskStreamWebSocketServer_loaded_modelpath, "f")[transcription_request_info.model];
                                if (modelpath) {
                                    await transcriber?.stop();
                                    transcription_callback ? transcriber?.removeListener("transcription", transcription_callback) : null;
                                    transcriber = new transcriber_1.default({ modelpath: modelpath });
                                    !transcriber?.active ? await transcriber?.start() : null;
                                    transcription_callback = getTranscriptionCallback(socket, old_transcription_memory);
                                    transcriber?.on("transcription", transcription_callback);
                                    socket.sendUTF(JSON.stringify({ model: transcription_request_info.model }));
                                }
                            }
                        }
                        else {
                            transcriber?.transcribe(message.binaryData);
                        }
                    });
                }
            });
        }
    }
    setRequestFilter(cb) {
        cb instanceof Function ? __classPrivateFieldSet(this, _VoskStreamWebSocketServer_request_filter, cb, "f") : null;
    }
    //
    async loadModel(label, modelpath) {
        __classPrivateFieldGet(this, _VoskStreamWebSocketServer_loaded_modelpath, "f")[label] = modelpath;
        await transcriber_1.default.VOSK_MODELS.get(__classPrivateFieldGet(this, _VoskStreamWebSocketServer_loaded_modelpath, "f")[label]);
    }
    unloadModel(label) {
        delete __classPrivateFieldGet(this, _VoskStreamWebSocketServer_loaded_modelpath, "f")[label];
    }
    //
    close() {
        __classPrivateFieldGet(this, _VoskStreamWebSocketServer_wss, "f")?.shutDown();
        __classPrivateFieldSet(this, _VoskStreamWebSocketServer_wss, null, "f");
        __classPrivateFieldSet(this, _VoskStreamWebSocketServer_closed, true, "f");
    }
}
exports.default = VoskStreamWebSocketServer;
_VoskStreamWebSocketServer_loaded_modelpath = new WeakMap(), _VoskStreamWebSocketServer_httpServer = new WeakMap(), _VoskStreamWebSocketServer_wss = new WeakMap(), _VoskStreamWebSocketServer_request_filter = new WeakMap(), _VoskStreamWebSocketServer_closed = new WeakMap();
function getTranscriptionCallback(socket, old_transcription_memory) {
    let cb = (transcription) => {
        if ((transcription.partial != old_transcription_memory[0]?.partial
            || transcription.content != old_transcription_memory[0]?.content)
            &&
                (transcription.partial || transcription.content.length > 0)) {
            socket.sendUTF(JSON.stringify(transcription));
            old_transcription_memory[0] = transcription;
        }
    };
    return cb;
}
//# sourceMappingURL=server.js.map