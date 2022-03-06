import * as path from "path";
import * as net from "net";
import { ChildProcess, spawn } from "child_process";
import pathToFfmpeg = require("ffmpeg-static");
import EventEmitter = require("events");

const vosk = require("vosk");

const ffmpeg_streaming_args = [
    "-loglevel", "quiet",
    "-i", "-",
    "-ar", "16000",
    "-ac", "1",
    "-f", "s16le",
    "-"
];

type TRANSCRIBER_EVENTS = "start" | "transcription" | "stop";
export type TranscriptionType = { partial: boolean, content: string }
export default class Transcriber extends EventEmitter {

    static VOSK_MODELS = {
        get(modelpath: string): Promise<any> {
            return new Promise((resolve, reject) => {
                setImmediate(() => {
                    let model = (Transcriber.VOSK_MODELS as any)[modelpath];
                    if(!model) {
                        let model = new vosk.Model(modelpath);
                        (Transcriber.VOSK_MODELS as any)[modelpath] = model
                        model = (Transcriber.VOSK_MODELS as any)[modelpath];
                    }
                    
                    resolve(model);
                });
            });
        }
    };

    //

    #ffmpeg_process: ChildProcess | null = null;

    #modelpath: string;

    #recognizer: any;

    #active = false;

    constructor(options: { modelpath: string }) {
        super();

        this.#modelpath = options.modelpath;
    }

    //

    get modelpath() { return this.#modelpath; }

    get active() { return this.#active; }

    //

    addListener(event: TRANSCRIBER_EVENTS, listener: (...args: any[]) => void) { return super.addListener(event, listener); }
    
    on(event: TRANSCRIBER_EVENTS, listener: (...args: any[]) => void) { return super.on(event, listener); }

    once(event: TRANSCRIBER_EVENTS, listener: (...args: any[]) => void) { return super.once(event, listener); }
    
    removeListener(event: TRANSCRIBER_EVENTS, listener: (...args: any[]) => void) { return super.removeListener(event, listener); }

    removeAllListeners(event: TRANSCRIBER_EVENTS) { return super.removeAllListeners(event); }

    off(event: TRANSCRIBER_EVENTS, listener?: (...args: any[]) => void) { return listener ? super.off(event, listener) : super.removeAllListeners(event); }

    emit(event: TRANSCRIBER_EVENTS, ...args: any[]) { return super.emit(event, ...args); }

    //

    start() {
        return new Promise(async (resolve, reject) => {
            this.#recognizer = new vosk.Recognizer({ model: (await Transcriber.VOSK_MODELS.get(this.modelpath)), sampleRate: 16000 });

            this.#ffmpeg_process = spawn(pathToFfmpeg, ffmpeg_streaming_args);

            this.#ffmpeg_process.once("spawn", () => {
                this.#ffmpeg_process?.stdout?.on("data", (data) => {
                    let partial = !this.#recognizer.acceptWaveform(data);
                    this.emit("transcription", {
                        partial: partial,
                        content: ''+(partial ? this.#recognizer.partialResult().partial : this.#recognizer.result().text)
                    });
                });

                this.#active = true;
                this.emit("start");
                resolve(true);
            });
        });
    }

    transcribe(buffer: Buffer) {
        this.#ffmpeg_process?.stdin?.write(buffer);
    }

    stop() {
        return new Promise((resolve, reject) => {
            this.#ffmpeg_process?.once("exit", () => {
                this.#active = false;
                this.emit("stop");
                resolve(true);
            });

            this.#ffmpeg_process?.stdin?.end();
            this.#ffmpeg_process?.kill();
        });
    }

}