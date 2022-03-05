import { Listener } from "../utils/listener.class";
declare type RECORD_EVENTS = "start" | "data" | "stop";
export declare class Record_ extends Listener {
    #private;
    constructor({ type, recorder }: {
        type: string;
        recorder?: Recorder | null;
    });
    get type(): string;
    get stream(): MediaStream | null;
    get media_recorder(): MediaRecorder | null;
    get recorder(): Recorder | null;
    get stopped(): boolean;
    on(event: RECORD_EVENTS, callback: Function): void;
    once(event: RECORD_EVENTS, callback: Function): void;
    removeListener(event: RECORD_EVENTS, callback: Function): void;
    removeListeners(event: RECORD_EVENTS): void;
    off(event: RECORD_EVENTS, callback?: Function): void;
    callEvent(event: RECORD_EVENTS, ...args: any): Promise<unknown>;
    setStreamRate(ms: number): void;
    start(): Promise<boolean>;
    stop(): Promise<unknown>;
    blob(): Promise<Blob>;
    base64(): Promise<string>;
    datauri(): Promise<string>;
    remove(): void;
}
declare class RecordList {
    #private;
    constructor();
    get(index: number): Record_;
    add(record: Record_): void;
    remove(record: Record_ | number): void;
    all(): ReadonlyArray<Record_>;
    clear(): void;
}
export declare class Recorder {
    #private;
    static Record: typeof Record_;
    constructor();
    get records(): RecordList;
    record(options?: {
        type?: string;
    } | undefined): Record_;
    stop(): void;
    clear(): void;
}
export {};
