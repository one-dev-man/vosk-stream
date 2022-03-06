import { Listener } from "../utils/listener.class";
import { Recorder, Record_ } from "./recorder";

type VOSKSTREAM_WEBSOCKET_CLIENT_EVENTS = "open" | "model" | "transcription" | "close" | "error";

export default class VoskStreamWebSocketClient extends Listener {

    #ws_rul: string | URL | undefined | null = null;

    #ws_protocols: string | string[] | undefined | null = null;

    #ws: WebSocket | null = null;

    #record: Record_ | null = null;

    #closed = true;

    #langModel: string | null = null;

    constructor(url: string | URL, protocols?: string | string[] | undefined) {
        super();

        this.#ws_rul = url;
        this.#ws_protocols = protocols;
    }

    //

    get url() { return this.#ws_rul; }

    get protocols() { return this.#ws_protocols; }

    get websocket() { return this.#ws; }

    get closed() { return this.#closed; }
    
    get langModel() { return this.#langModel; }

    //

    on(event: VOSKSTREAM_WEBSOCKET_CLIENT_EVENTS, callback: Function) { return super.on(event, callback); }

    once(event: VOSKSTREAM_WEBSOCKET_CLIENT_EVENTS, callback: Function) { return super.once(event, callback); }

    removeListener(event: VOSKSTREAM_WEBSOCKET_CLIENT_EVENTS, callback: Function) { return super.removeListener(event, callback); }

    removeListeners(event: VOSKSTREAM_WEBSOCKET_CLIENT_EVENTS) { return super.removeListeners(event); }

    off(event: VOSKSTREAM_WEBSOCKET_CLIENT_EVENTS, callback?: Function) { return super.off(event, callback); }

    callEvent(event: VOSKSTREAM_WEBSOCKET_CLIENT_EVENTS, ...args: any[]) { return super.callEvent(event, ...args); }

    //

    open() {
        return new Promise((resolve, reject) => {
            this.once("open", () => resolve(true));

            this.#ws = new WebSocket(this.url ? this.url instanceof URL ? this.url.href : this.url : "", this.protocols || undefined);

            this.#ws.addEventListener("open", () => {
                this.#ws?.addEventListener("message", message => {
                    let response = JSON.parse(message.data);
                    this.callEvent(response.event, response.content);
                });
    
                this.#closed = false;
                this.callEvent("open");
            });
    
            this.#ws.addEventListener("error", (...args) => {
                this.callEvent("error", ...args);
            });
    
            //
    
            this.#record = new Recorder().record();
            let on_record_data = (d: ArrayBuffer) => {
                this.transcribe(d);
            };
            this.#record.on("data", on_record_data);
    
            //
    
            this.#ws.addEventListener("close", async () => {
                this.#record?.off("data", on_record_data);
                await this.#record?.stop();
                this.#record = null;
                this.#ws = null;
                this.#closed = true;
                this.callEvent("close");
            });
        });
    }

    close() {
        return new Promise((resolve, reject) => {
            this.once("close", () => resolve(true));
            this.#ws?.close();
        });
    }

    //

    getLangModels() {
        return new Promise((resolve, reject) => {
            let request = {
                event: (""+Date.now() as any),
                content: {
                    command: "get_models"
                },
            }

            this.once(request.event, (content: { models: string }) => {
                resolve(content.models);
            });

            this.#send(request);
        });
    }

    setLangModel(label: string | null) {
        return new Promise((resolve, reject) => {
            let request = {
                event: (""+Date.now() as any),
                content: {
                    command: "set_model",
                    model: label
                },
            }

            this.once(request.event, (content: { model: string }) => {
                resolve(content.model);
            });

            !this.#closed && label ? this.#send(request) : null;
        });
    }

    transcribe(buffer: ArrayBufferLike | ArrayBufferView | Blob) {
        this.#ws?.send(buffer);
    }

    async startRecording() {
        return await this.#record?.start();
    }

    async stopRecording() {
        return await this.#record?.stop();
    }

    //

    #send = (event: string | null | { event: string | null, content: any }, content?: any) => {
        let request = ( (event instanceof Object) && !(event instanceof Array) ) ? event : { event: event, content: content };
        this.#ws?.send(JSON.stringify(request));
    }

}

try { window ? window["VoskStream"] = { Client: VoskStreamWebSocketClient } : null; } catch(e) {}