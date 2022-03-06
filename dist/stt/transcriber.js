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
var _Transcriber_ffmpeg_process, _Transcriber_modelpath, _Transcriber_recognizer, _Transcriber_active;
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const pathToFfmpeg = require("ffmpeg-static");
const EventEmitter = require("events");
const vosk = require("vosk");
const ffmpeg_streaming_args = [
    "-loglevel", "quiet",
    "-i", "-",
    "-ar", "16000",
    "-ac", "1",
    "-f", "s16le",
    "-"
];
class Transcriber extends EventEmitter {
    constructor(options) {
        super();
        //
        _Transcriber_ffmpeg_process.set(this, null);
        _Transcriber_modelpath.set(this, void 0);
        _Transcriber_recognizer.set(this, void 0);
        _Transcriber_active.set(this, false);
        __classPrivateFieldSet(this, _Transcriber_modelpath, options.modelpath, "f");
    }
    //
    get modelpath() { return __classPrivateFieldGet(this, _Transcriber_modelpath, "f"); }
    get active() { return __classPrivateFieldGet(this, _Transcriber_active, "f"); }
    //
    addListener(event, listener) { return super.addListener(event, listener); }
    on(event, listener) { return super.on(event, listener); }
    once(event, listener) { return super.once(event, listener); }
    removeListener(event, listener) { return super.removeListener(event, listener); }
    removeAllListeners(event) { return super.removeAllListeners(event); }
    off(event, listener) { return listener ? super.off(event, listener) : super.removeAllListeners(event); }
    emit(event, ...args) { return super.emit(event, ...args); }
    //
    start() {
        return new Promise(async (resolve, reject) => {
            __classPrivateFieldSet(this, _Transcriber_recognizer, new vosk.Recognizer({ model: (await Transcriber.VOSK_MODELS.get(this.modelpath)), sampleRate: 16000 }), "f");
            __classPrivateFieldSet(this, _Transcriber_ffmpeg_process, (0, child_process_1.spawn)(pathToFfmpeg, ffmpeg_streaming_args), "f");
            __classPrivateFieldGet(this, _Transcriber_ffmpeg_process, "f").once("spawn", () => {
                __classPrivateFieldGet(this, _Transcriber_ffmpeg_process, "f")?.stdout?.on("data", (data) => {
                    let partial = !__classPrivateFieldGet(this, _Transcriber_recognizer, "f").acceptWaveform(data);
                    this.emit("transcription", {
                        partial: partial,
                        content: '' + (partial ? __classPrivateFieldGet(this, _Transcriber_recognizer, "f").partialResult().partial : __classPrivateFieldGet(this, _Transcriber_recognizer, "f").result().text)
                    });
                });
                __classPrivateFieldSet(this, _Transcriber_active, true, "f");
                this.emit("start");
                resolve(true);
            });
        });
    }
    transcribe(buffer) {
        __classPrivateFieldGet(this, _Transcriber_ffmpeg_process, "f")?.stdin?.write(buffer);
    }
    stop() {
        return new Promise((resolve, reject) => {
            __classPrivateFieldGet(this, _Transcriber_ffmpeg_process, "f")?.once("exit", () => {
                __classPrivateFieldSet(this, _Transcriber_active, false, "f");
                this.emit("stop");
                resolve(true);
            });
            __classPrivateFieldGet(this, _Transcriber_ffmpeg_process, "f")?.stdin?.end();
            __classPrivateFieldGet(this, _Transcriber_ffmpeg_process, "f")?.kill();
        });
    }
}
exports.default = Transcriber;
_Transcriber_ffmpeg_process = new WeakMap(), _Transcriber_modelpath = new WeakMap(), _Transcriber_recognizer = new WeakMap(), _Transcriber_active = new WeakMap();
Transcriber.VOSK_MODELS = {
    get(modelpath) {
        return new Promise((resolve, reject) => {
            setImmediate(() => {
                let model = Transcriber.VOSK_MODELS[modelpath];
                if (!model) {
                    let model = new vosk.Model(modelpath);
                    Transcriber.VOSK_MODELS[modelpath] = model;
                    model = Transcriber.VOSK_MODELS[modelpath];
                }
                resolve(model);
            });
        });
    }
};
//# sourceMappingURL=transcriber.js.map