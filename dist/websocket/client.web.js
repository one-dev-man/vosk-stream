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
var _VoskStreamWebSocketClient_ws_rul, _VoskStreamWebSocketClient_ws_protocols, _VoskStreamWebSocketClient_ws, _VoskStreamWebSocketClient_record, _VoskStreamWebSocketClient_closed, _VoskStreamWebSocketClient_langModel;
Object.defineProperty(exports, "__esModule", { value: true });
const listener_class_1 = require("../utils/listener.class");
const recorder_1 = require("./recorder");
class VoskStreamWebSocketClient extends listener_class_1.Listener {
    constructor(url, protocols) {
        super();
        _VoskStreamWebSocketClient_ws_rul.set(this, null);
        _VoskStreamWebSocketClient_ws_protocols.set(this, null);
        _VoskStreamWebSocketClient_ws.set(this, null);
        _VoskStreamWebSocketClient_record.set(this, null);
        _VoskStreamWebSocketClient_closed.set(this, true);
        _VoskStreamWebSocketClient_langModel.set(this, null);
        __classPrivateFieldSet(this, _VoskStreamWebSocketClient_ws_rul, url, "f");
        __classPrivateFieldSet(this, _VoskStreamWebSocketClient_ws_protocols, protocols, "f");
    }
    //
    get url() { return __classPrivateFieldGet(this, _VoskStreamWebSocketClient_ws_rul, "f"); }
    get protocols() { return __classPrivateFieldGet(this, _VoskStreamWebSocketClient_ws_protocols, "f"); }
    get websocket() { return __classPrivateFieldGet(this, _VoskStreamWebSocketClient_ws, "f"); }
    get closed() { return __classPrivateFieldGet(this, _VoskStreamWebSocketClient_closed, "f"); }
    get langModel() { return __classPrivateFieldGet(this, _VoskStreamWebSocketClient_langModel, "f"); }
    //
    on(event, callback) { return super.on(event, callback); }
    once(event, callback) { return super.once(event, callback); }
    removeListener(event, callback) { return super.removeListener(event, callback); }
    removeListeners(event) { return super.removeListeners(event); }
    off(event, callback) { return super.off(event, callback); }
    callEvent(event, ...args) { return super.callEvent(event, ...args); }
    //
    setLangModel(label) {
        !__classPrivateFieldGet(this, _VoskStreamWebSocketClient_closed, "f") && label ? __classPrivateFieldGet(this, _VoskStreamWebSocketClient_ws, "f")?.send(JSON.stringify({ model: label })) : null;
    }
    transcribe(buffer) {
        __classPrivateFieldGet(this, _VoskStreamWebSocketClient_ws, "f")?.send(buffer);
    }
    async startRecording() {
        return await __classPrivateFieldGet(this, _VoskStreamWebSocketClient_record, "f")?.start();
    }
    async stopRecording() {
        return await __classPrivateFieldGet(this, _VoskStreamWebSocketClient_record, "f")?.stop();
    }
    //
    open() {
        return new Promise((resolve, reject) => {
            this.once("open", () => resolve(true));
            __classPrivateFieldSet(this, _VoskStreamWebSocketClient_ws, new WebSocket(this.url || "", this.protocols || undefined), "f");
            __classPrivateFieldGet(this, _VoskStreamWebSocketClient_ws, "f").addEventListener("open", () => {
                __classPrivateFieldGet(this, _VoskStreamWebSocketClient_ws, "f")?.addEventListener("message", message => {
                    let response = JSON.parse(message.data);
                    if (response.model) {
                        __classPrivateFieldSet(this, _VoskStreamWebSocketClient_langModel, response.model, "f");
                        this.callEvent("model", this.langModel);
                    }
                    else {
                        this.callEvent("transcription", response);
                    }
                });
                __classPrivateFieldSet(this, _VoskStreamWebSocketClient_closed, false, "f");
                this.callEvent("open");
            });
            __classPrivateFieldGet(this, _VoskStreamWebSocketClient_ws, "f").addEventListener("error", (...args) => {
                this.callEvent("error", ...args);
            });
            //
            __classPrivateFieldSet(this, _VoskStreamWebSocketClient_record, new recorder_1.Recorder().record(), "f");
            let on_record_data = (d) => {
                this.transcribe(d);
            };
            __classPrivateFieldGet(this, _VoskStreamWebSocketClient_record, "f").on("data", on_record_data);
            //
            __classPrivateFieldGet(this, _VoskStreamWebSocketClient_ws, "f").addEventListener("close", async () => {
                __classPrivateFieldGet(this, _VoskStreamWebSocketClient_record, "f")?.off("data", on_record_data);
                await __classPrivateFieldGet(this, _VoskStreamWebSocketClient_record, "f")?.stop();
                __classPrivateFieldSet(this, _VoskStreamWebSocketClient_record, null, "f");
                __classPrivateFieldSet(this, _VoskStreamWebSocketClient_ws, null, "f");
                __classPrivateFieldSet(this, _VoskStreamWebSocketClient_closed, true, "f");
                this.callEvent("close");
            });
        });
    }
    close() {
        return new Promise((resolve, reject) => {
            this.once("close", () => resolve(true));
            __classPrivateFieldGet(this, _VoskStreamWebSocketClient_ws, "f")?.close();
        });
    }
}
exports.default = VoskStreamWebSocketClient;
_VoskStreamWebSocketClient_ws_rul = new WeakMap(), _VoskStreamWebSocketClient_ws_protocols = new WeakMap(), _VoskStreamWebSocketClient_ws = new WeakMap(), _VoskStreamWebSocketClient_record = new WeakMap(), _VoskStreamWebSocketClient_closed = new WeakMap(), _VoskStreamWebSocketClient_langModel = new WeakMap();
window ? window["VoskStream"] = { Client: VoskStreamWebSocketClient } : null;
//# sourceMappingURL=client.web.js.map