import { Listener } from "../utils/listener.class";
declare type VOSKSTREAM_WEBSOCKET_CLIENT_EVENTS = "open" | "model" | "transcription" | "close" | "error";
export default class VoskStreamWebSocketClient extends Listener {
    #private;
    constructor(url: string | URL, protocols?: string | string[] | undefined);
    get url(): string | URL | null | undefined;
    get protocols(): string | string[] | null | undefined;
    get websocket(): WebSocket | null;
    get closed(): boolean;
    get langModel(): string | null;
    on(event: VOSKSTREAM_WEBSOCKET_CLIENT_EVENTS, callback: Function): void;
    once(event: VOSKSTREAM_WEBSOCKET_CLIENT_EVENTS, callback: Function): void;
    removeListener(event: VOSKSTREAM_WEBSOCKET_CLIENT_EVENTS, callback: Function): void;
    removeListeners(event: VOSKSTREAM_WEBSOCKET_CLIENT_EVENTS): void;
    off(event: VOSKSTREAM_WEBSOCKET_CLIENT_EVENTS, callback?: Function): void;
    callEvent(event: VOSKSTREAM_WEBSOCKET_CLIENT_EVENTS, ...args: any[]): Promise<unknown>;
    open(): Promise<unknown>;
    close(): Promise<unknown>;
    getLangModels(): Promise<unknown>;
    setLangModel(label: string | null): Promise<unknown>;
    transcribe(buffer: ArrayBufferLike | ArrayBufferView | Blob): void;
    startRecording(): Promise<boolean | undefined>;
    stopRecording(): Promise<unknown>;
}
export {};
