/// <reference types="node" />
import EventEmitter = require("events");
declare type TRANSCRIBER_EVENTS = "start" | "transcription" | "stop";
export declare type TranscriptionType = {
    partial: boolean;
    content: string;
};
export default class Transcriber extends EventEmitter {
    #private;
    static VOSK_MODELS: {
        get(modelpath: string): Promise<any>;
    };
    constructor(options: {
        modelpath: string;
    });
    get modelpath(): string;
    get active(): boolean;
    addListener(event: TRANSCRIBER_EVENTS, listener: (...args: any[]) => void): this;
    on(event: TRANSCRIBER_EVENTS, listener: (...args: any[]) => void): this;
    once(event: TRANSCRIBER_EVENTS, listener: (...args: any[]) => void): this;
    removeListener(event: TRANSCRIBER_EVENTS, listener: (...args: any[]) => void): this;
    removeAllListeners(event: TRANSCRIBER_EVENTS): this;
    off(event: TRANSCRIBER_EVENTS, listener?: (...args: any[]) => void): this;
    emit(event: TRANSCRIBER_EVENTS, ...args: any[]): boolean;
    start(): Promise<unknown>;
    transcribe(buffer: Buffer): void;
    stop(): Promise<unknown>;
}
export {};
