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
var _Record__type, _Record__stream, _Record__media_recorder, _Record__recorder, _Record__chunks, _Record__blob, _Record__blob_callbacks, _Record__stopped, _Record__request_data_interval, _RecordList_list, _Recorder_records;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Recorder = exports.Record_ = void 0;
const listener_class_1 = require("../../src/utils/listener.class");
class Record_ extends listener_class_1.Listener {
    constructor({ type, recorder = null }) {
        super();
        _Record__type.set(this, void 0);
        _Record__stream.set(this, null);
        _Record__media_recorder.set(this, null);
        _Record__recorder.set(this, void 0);
        _Record__chunks.set(this, null);
        _Record__blob.set(this, null);
        _Record__blob_callbacks.set(this, new Array());
        _Record__stopped.set(this, true);
        _Record__request_data_interval.set(this, null);
        __classPrivateFieldSet(this, _Record__type, type, "f");
        __classPrivateFieldSet(this, _Record__recorder, recorder, "f");
        this.recorder?.records.add(this);
    }
    //
    get type() { return __classPrivateFieldGet(this, _Record__type, "f"); }
    get stream() { return __classPrivateFieldGet(this, _Record__stream, "f"); }
    get media_recorder() { return __classPrivateFieldGet(this, _Record__media_recorder, "f"); }
    get recorder() { return __classPrivateFieldGet(this, _Record__recorder, "f"); }
    get stopped() { return __classPrivateFieldGet(this, _Record__stopped, "f"); }
    //
    on(event, callback) { return super.on(event, callback); }
    once(event, callback) { return super.once(event, callback); }
    removeListener(event, callback) { return super.removeListener(event, callback); }
    removeListeners(event) { return super.removeListeners(event); }
    off(event, callback) { return super.off(event, callback); }
    callEvent(event, ...args) { return super.callEvent(event, ...args); }
    //
    setStreamRate(ms) {
        clearInterval(__classPrivateFieldGet(this, _Record__request_data_interval, "f"));
        __classPrivateFieldSet(this, _Record__request_data_interval, setInterval(() => { this.media_recorder?.requestData(); }, ms), "f");
    }
    //
    async start() {
        __classPrivateFieldSet(this, _Record__stopped, false, "f");
        __classPrivateFieldSet(this, _Record__chunks, new Array(), "f");
        __classPrivateFieldSet(this, _Record__stream, await navigator.mediaDevices.getUserMedia({
            video: false,
            audio: {
                echoCancellation: true,
                noiseSuppression: true,
                channelCount: 1,
                sampleRate: 16000
            }
        }), "f");
        __classPrivateFieldSet(this, _Record__media_recorder, new MediaRecorder(__classPrivateFieldGet(this, _Record__stream, "f")), "f");
        if (this.media_recorder) {
            this.media_recorder.addEventListener("dataavailable", async (e) => {
                if (!e.data)
                    return;
                if (e.data.size == 0)
                    return;
                __classPrivateFieldGet(this, _Record__chunks, "f")?.push(e.data);
                this.callEvent("data", await e.data.arrayBuffer());
            });
            this.media_recorder.start();
            this.setStreamRate(500);
            this.callEvent("start");
            return true;
        }
        return false;
    }
    stop() {
        return new Promise((resolve, reject) => {
            if (this.media_recorder && this.stream) {
                if (this.media_recorder.state != "inactive") {
                    this.media_recorder.addEventListener("stop", (e) => {
                        __classPrivateFieldSet(this, _Record__blob, new Blob(__classPrivateFieldGet(this, _Record__chunks, "f"), { type: this.type }), "f");
                        __classPrivateFieldGet(this, _Record__blob_callbacks, "f").forEach(cb => { cb(); });
                        let bcbl = __classPrivateFieldGet(this, _Record__blob_callbacks, "f").length;
                        for (let i = 0; i < bcbl; ++i) {
                            __classPrivateFieldGet(this, _Record__blob_callbacks, "f").shift();
                        }
                        let stream_tracks = this.stream?.getTracks();
                        stream_tracks?.forEach(track => {
                            track.stop();
                        });
                        clearInterval(__classPrivateFieldGet(this, _Record__request_data_interval, "f"));
                        __classPrivateFieldSet(this, _Record__stopped, true, "f");
                        this.callEvent("stop");
                        resolve(true);
                    });
                    this.media_recorder.stop();
                }
            }
        });
    }
    //
    async blob() {
        return new Promise((resolve, reject) => {
            if (__classPrivateFieldGet(this, _Record__blob, "f") instanceof Blob) {
                resolve(__classPrivateFieldGet(this, _Record__blob, "f"));
            }
            else {
                __classPrivateFieldGet(this, _Record__blob_callbacks, "f").push(() => {
                    if (__classPrivateFieldGet(this, _Record__blob, "f") instanceof Blob) {
                        resolve(__classPrivateFieldGet(this, _Record__blob, "f"));
                    }
                });
            }
        });
    }
    async base64() {
        let blob = await this.blob();
        let file = new File([blob], "record", { type: this.type });
        let file_buffer = (await file.stream().getReader().read()).value;
        return buffer2b64(file_buffer);
    }
    async datauri() {
        return "data:" + this.type + ";base64," + (await this.base64());
    }
    //
    remove() {
        this.recorder?.records.remove(this);
    }
}
exports.Record_ = Record_;
_Record__type = new WeakMap(), _Record__stream = new WeakMap(), _Record__media_recorder = new WeakMap(), _Record__recorder = new WeakMap(), _Record__chunks = new WeakMap(), _Record__blob = new WeakMap(), _Record__blob_callbacks = new WeakMap(), _Record__stopped = new WeakMap(), _Record__request_data_interval = new WeakMap();
class RecordList {
    constructor() {
        _RecordList_list.set(this, new Array());
    }
    //
    get(index) {
        return __classPrivateFieldGet(this, _RecordList_list, "f")[index];
    }
    add(record) {
        if (!__classPrivateFieldGet(this, _RecordList_list, "f").includes(record)) {
            __classPrivateFieldGet(this, _RecordList_list, "f").push(record);
        }
    }
    remove(record) {
        let index = record instanceof Record_ ? __classPrivateFieldGet(this, _RecordList_list, "f").indexOf(record) : record;
        if (index > -1 && index < __classPrivateFieldGet(this, _RecordList_list, "f").length) {
            let a = new Array(), b = new Array();
            for (let i = 0; i < index; ++i) {
                a.push(__classPrivateFieldGet(this, _RecordList_list, "f")[i]);
            }
            for (let i = index + 1; i < __classPrivateFieldGet(this, _RecordList_list, "f").length; ++i) {
                b.push(__classPrivateFieldGet(this, _RecordList_list, "f")[i]);
            }
            __classPrivateFieldSet(this, _RecordList_list, a.concat(b), "f");
        }
    }
    all() {
        let result = new Array();
        for (let i = 0; i < __classPrivateFieldGet(this, _RecordList_list, "f").length; ++i) {
            result.push(__classPrivateFieldGet(this, _RecordList_list, "f")[i]);
        }
        return result;
    }
    clear() {
        __classPrivateFieldSet(this, _RecordList_list, new Array(), "f");
    }
}
_RecordList_list = new WeakMap();
class Recorder {
    constructor() {
        //
        _Recorder_records.set(this, new RecordList());
    }
    //
    get records() { return __classPrivateFieldGet(this, _Recorder_records, "f"); }
    //
    record(options) {
        let record = new Record_({ type: options?.type || "audio/wav", recorder: this });
        return record;
    }
    stop() {
        this.records.all().forEach(record => {
            record.stop();
        });
    }
    clear() {
        this.stop();
        this.records.clear();
    }
}
exports.Recorder = Recorder;
_Recorder_records = new WeakMap();
Recorder.Record = Record_;
function buffer2b64(arrayBuffer) { let base64 = ''; let encodings = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'; let bytes = new Uint8Array(arrayBuffer); let byteLength = bytes.byteLength; let byteRemainder = byteLength % 3; let mainLength = byteLength - byteRemainder; let a, b, c, d; let chunk; for (let i = 0; i < mainLength; i = i + 3) {
    chunk = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2];
    a = (chunk & 16515072) >> 18;
    b = (chunk & 258048) >> 12;
    c = (chunk & 4032) >> 6;
    d = chunk & 63;
    base64 += encodings[a] + encodings[b] + encodings[c] + encodings[d];
} if (byteRemainder == 1) {
    chunk = bytes[mainLength];
    a = (chunk & 252) >> 2;
    b = (chunk & 3) << 4;
    base64 += encodings[a] + encodings[b] + '==';
}
else if (byteRemainder == 2) {
    chunk = (bytes[mainLength] << 8) | bytes[mainLength + 1];
    a = (chunk & 64512) >> 10;
    b = (chunk & 1008) >> 4;
    c = (chunk & 15) << 2;
    base64 += encodings[a] + encodings[b] + encodings[c] + '=';
} return base64; }
window ? window["Recorder"] = Recorder : null;
