import EventEmitter = require("events");
import * as http from "http";

import WebSocket = require("websocket");
import Transcriber, { TranscriptionType } from "../stt/transcriber";

type VOSKSTREAM_WEBSOCKET_SERVER_EVENTS = "open" | "close" | "error";

export default class VoskStreamWebSocketServer extends EventEmitter {

    #loaded_modelpath: {[key: string]: string} = {};

    #httpServer: http.Server;

    #wss: WebSocket.server | null = null;

    #request_filter = async (request: WebSocket.request) => { return true; }

    #closed = true;

    constructor(options: {
        httpServer: http.Server
    }) {
        super();

        this.#httpServer = options.httpServer;
    }

    //

    get httpServer() { return this.#httpServer; }

    get wss() { return this.#wss; }

    get closed() { return this.#closed; }

    //

    on(event: VOSKSTREAM_WEBSOCKET_SERVER_EVENTS, callback: (...args: any[]) => void) { return super.on(event, callback); }

    once(event: VOSKSTREAM_WEBSOCKET_SERVER_EVENTS, callback: (...args: any[]) => void) { return super.once(event, callback); }

    removeListener(event: VOSKSTREAM_WEBSOCKET_SERVER_EVENTS, callback: (...args: any[]) => void) { return super.removeListener(event, callback); }

    removeAllListeners(event: VOSKSTREAM_WEBSOCKET_SERVER_EVENTS) { return super.removeAllListeners(event); }

    off(event: VOSKSTREAM_WEBSOCKET_SERVER_EVENTS, callback: (...args: any[]) => void) { return super.off(event, callback); }

    emit(event: VOSKSTREAM_WEBSOCKET_SERVER_EVENTS, ...args: any) { return super.emit(event, ...args); }

    //

    open() {
        if(this.closed) {
            this.#wss = new WebSocket.server({
                httpServer: this.httpServer
            });

            this.#wss.on("request", async (socket_request) => {
                if(await this.#request_filter(socket_request)) {
                    let transcriber: Transcriber | null = null;
                    let socket = socket_request.accept();

                    let transcription_callback: Function | null = null;
                    
                    let old_transcription_memory: Array<TranscriptionType | null> = [null];
                    socket.on("message", async (message) => {
                        if(message.type == "utf8") {
                            let request: { event: string | null, content: any } = JSON.parse(message.utf8Data);
                            let response: { event: string | null, content: any } = {} as any;

                            this.emit((request.event || "") as any, socket, request.content);

                            if(request.content.command == "set_model") {
                                let modelpath = this.#loaded_modelpath[request.content.model];
                                if(modelpath) {
                                    await transcriber?.stop();
                                    transcription_callback ? transcriber?.removeListener("transcription", transcription_callback as any) : null;

                                    transcriber = new Transcriber({ modelpath: modelpath });
                                    !transcriber?.active ? await transcriber?.start() : null;

                                    transcription_callback = getTranscriptionCallback(socket, response, old_transcription_memory);

                                    transcriber?.on("transcription", transcription_callback as any);

                                    response.event = request.event;
                                    response.content = { model: request.content.model };
                                }
                            }
                            else if(request.content.command == "get_models") {
                                response.event = request.event
                                response.content = { models: Object.keys(this.#loaded_modelpath) };
                            }

                            socket.sendUTF(JSON.stringify(response));
                        }
                        else {
                            transcriber?.transcribe(message.binaryData);
                        }
                    });
                }
            });

            this.#closed = false;
            this.emit("open");
        }
    }

    close() {
        this.#wss?.shutDown();
        this.#wss = null;
        this.#closed = true;
        this.emit("close");
    }

    //

    setRequestFilter(cb: (request: WebSocket.request) => Promise<boolean>) {
        cb instanceof Function ? this.#request_filter = cb : null;
    }

    //

    async loadModel(label: string, modelpath: string) {
        this.#loaded_modelpath[label] = modelpath;
        await Transcriber.VOSK_MODELS.get(this.#loaded_modelpath[label]);
    }

    async unloadModel(label: string) {
        (await Transcriber.VOSK_MODELS.get(this.#loaded_modelpath[label])).free();
        delete this.#loaded_modelpath[label];
    }

}

function getTranscriptionCallback(socket: WebSocket.connection, response: { event: string | null, content: any }, old_transcription_memory: Array<TranscriptionType | null>) {
    let cb = (transcription: TranscriptionType) => {
        if(
            ( transcription.partial != old_transcription_memory[0]?.partial
              || transcription.content != old_transcription_memory[0]?.content )
            &&
            ( !transcription.partial || transcription.content.length > 0 )
        ) {
            response.event = "transcription";
            response.content = transcription;

            socket.sendUTF(JSON.stringify(response));
            old_transcription_memory[0] = transcription
        }
    }
    return cb;
}