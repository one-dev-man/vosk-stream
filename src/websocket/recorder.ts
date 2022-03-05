import { Listener } from "../../src/utils/listener.class";

type RECORD_EVENTS = "start" | "data" | "stop";

export class Record_ extends Listener {

    #type: string;

    #stream: MediaStream | null = null;

    #media_recorder: MediaRecorder | null = null;

    #recorder: Recorder | null;

    #chunks: Array<Blob> | null = null;

    #blob: Blob | null = null;

    #blob_callbacks: Array<Function> = new Array<Function>();

    #stopped = true;

    #request_data_interval: any = null;

    constructor({ type, recorder=null }: { type: string, recorder?: Recorder | null }) {
        super();

        this.#type = type;
        this.#recorder = recorder;
        this.recorder?.records.add(this);
    }

    //

    get type() { return this.#type; }

    get stream() { return this.#stream; }

    get media_recorder() { return this.#media_recorder; }
    
    get recorder() { return this.#recorder; }

    get stopped() { return this.#stopped; }

    //

    on(event: RECORD_EVENTS, callback: Function) { return super.on(event, callback); }
    
    once(event: RECORD_EVENTS, callback: Function) { return super.once(event, callback); }

    removeListener(event: RECORD_EVENTS, callback: Function): void { return super.removeListener(event, callback); }

    removeListeners(event: RECORD_EVENTS): void { return super.removeListeners(event); }

    off(event: RECORD_EVENTS, callback?: Function): void { return super.off(event, callback); }

    callEvent(event: RECORD_EVENTS, ...args: any) { return super.callEvent(event, ...args); }

    //

    setStreamRate(ms: number) {
        clearInterval(this.#request_data_interval);
        this.#request_data_interval = setInterval(() => { this.media_recorder?.requestData(); }, ms);
    }

    //

    async start() {
        this.#stopped = false;

        this.#chunks = new Array<Blob>();

        this.#stream = await navigator.mediaDevices.getUserMedia({
            video: false,
            audio: { 
                echoCancellation: true,
                noiseSuppression: true,
                channelCount: 1,
                sampleRate: 16000
            }
        });

        this.#media_recorder = new MediaRecorder(this.#stream);

        if(this.media_recorder) {
            this.media_recorder.addEventListener("dataavailable", async (e) => {
                if(!e.data) return;
                if(e.data.size == 0) return;
                this.#chunks?.push(e.data);
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
            if(this.media_recorder && this.stream) {
                if(this.media_recorder.state != "inactive") {
                    this.media_recorder.addEventListener("stop", (e) => {
                        this.#blob = new Blob(this.#chunks as any, { type: this.type });
                        this.#blob_callbacks.forEach(cb => { cb(); });
                        let bcbl = this.#blob_callbacks.length;
                        for(let i = 0; i < bcbl; ++i) { this.#blob_callbacks.shift(); }

                        let stream_tracks = this.stream?.getTracks();
                        stream_tracks?.forEach(track => {
                            track.stop();
                        });

                        clearInterval(this.#request_data_interval);
        
                        this.#stopped = true;
                        this.callEvent("stop");
                        resolve(true);
                    });
    
                    this.media_recorder.stop();
                }
            }
        });
    }

    //

    async blob(): Promise<Blob> {
        return new Promise((resolve, reject) => {
            if(this.#blob instanceof Blob) { resolve(this.#blob); }
            else { this.#blob_callbacks.push(() => {
                if(this.#blob instanceof Blob) { resolve(this.#blob); }
            }); }
        })
    }

    async base64() {
        let blob = await this.blob();
        let file = new File([blob], "record", { type: this.type });
        let file_buffer = (await (file.stream() as any).getReader().read()).value;
        return buffer2b64(file_buffer);
    }

    async datauri() {
        return "data:"+this.type+";base64,"+(await this.base64());
    }

    //

    remove() {
        this.recorder?.records.remove(this);
    }

}

class RecordList {
    #list = new Array<Record_>();
    
    constructor() {

    }

    //

    get(index: number) {
        return this.#list[index];
    }

    add(record: Record_) {
        if(!this.#list.includes(record)) { this.#list.push(record); }
    }

    remove(record: Record_ | number) {
        let index = record instanceof Record_ ? this.#list.indexOf(record) : record;
        if(index > -1 && index < this.#list.length) {
            let a = new Array<Record_>(), b = new Array<Record_>();
            for(let i = 0; i < index; ++i) { a.push(this.#list[i]); }
            for(let i = index+1; i < this.#list.length; ++i) { b.push(this.#list[i]); }
            this.#list = a.concat(b);
        }
    }

    all(): ReadonlyArray<Record_> {
        let result = new Array<Record_>();
        for(let i = 0; i < this.#list.length; ++i) { result.push(this.#list[i]); }
        return result;
    }

    clear() {
        this.#list = new Array<Record_>();
    }

}

export class Recorder {

    static Record = Record_

    //

    #records = new RecordList();

    constructor() {
        
    }

    //

    get records() { return this.#records; }

    //

    record(options?: { type?: string } | undefined) {
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

function buffer2b64(arrayBuffer: ArrayLike<any> | ArrayBufferLike | Uint8Array) { let base64 = ''; let encodings = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'; let bytes = new Uint8Array(arrayBuffer); let byteLength = bytes.byteLength; let byteRemainder = byteLength % 3; let mainLength = byteLength - byteRemainder; let a, b, c, d; let chunk; for (let i = 0; i < mainLength; i = i + 3) { chunk = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2]; a = (chunk & 16515072) >> 18; b = (chunk & 258048) >> 12; c = (chunk & 4032) >> 6; d = chunk & 63; base64 += encodings[a] + encodings[b] + encodings[c] + encodings[d]; } if (byteRemainder == 1) { chunk = bytes[mainLength]; a = (chunk & 252) >> 2; b = (chunk & 3) << 4; base64 += encodings[a] + encodings[b] + '=='; } else if (byteRemainder == 2) { chunk = (bytes[mainLength] << 8) | bytes[mainLength + 1]; a = (chunk & 64512) >> 10; b = (chunk & 1008) >> 4; c = (chunk & 15) << 2; base64 += encodings[a] + encodings[b] + encodings[c] + '='; } return base64; }


window ? window["Recorder"] = Recorder : null;