import * as http from "http";

import WebSocket = require("websocket");
import Transcriber, { TranscriptionType } from "../stt/transcriber";

export default class VoskStreamWebSocketServer {

    #loaded_modelpath: {[key: string]: string} = {};

    #httpServer: http.Server;

    #wss: WebSocket.server | null = null;

    #request_filter = async (request: WebSocket.request) => { return true; }

    #closed = true;

    constructor(options: {
        httpServer: http.Server
    }) {
        this.#httpServer = options.httpServer;
    }

    //

    get httpServer() { return this.#httpServer; }

    get wss() { return this.#wss; }

    get closed() { return this.#closed; }

    //

    open() {
        if(this.closed) {
            this.#wss = new WebSocket.server({
                httpServer: this.httpServer
            });

            this.#wss.on("request", async (request) => {
                if(await this.#request_filter(request)) {
                    let transcriber: Transcriber | null = null;
                    let socket = request.accept();

                    let transcription_callback: Function | null = null;
                    
                    let old_transcription_memory: Array<TranscriptionType | null> = [null];
                    socket.on("message", async (message) => {
                        if(message.type == "utf8") {
                            let transcription_request_info = JSON.parse(message.utf8Data);
                            if(
                                typeof transcription_request_info.model == "string"
                            ) {
                                let modelpath = this.#loaded_modelpath[transcription_request_info.model];
                                if(modelpath) {
                                    await transcriber?.stop();
                                    transcription_callback ? transcriber?.removeListener("transcription", transcription_callback as any) : null;

                                    transcriber = new Transcriber({ modelpath: modelpath });
                                    !transcriber?.active ? await transcriber?.start() : null;

                                    transcription_callback = getTranscriptionCallback(socket, old_transcription_memory);

                                    transcriber?.on("transcription", transcription_callback as any);

                                    socket.sendUTF(JSON.stringify({ model: transcription_request_info.model }));
                                }
                            }
                        }
                        else {
                            transcriber?.transcribe(message.binaryData);
                        }
                    });
                }
            });
        }
    }

    setRequestFilter(cb: (request: WebSocket.request) => Promise<boolean>) {
        cb instanceof Function ? this.#request_filter = cb : null;
    }

    //

    async loadModel(label: string, modelpath: string) {
        this.#loaded_modelpath[label] = modelpath;
        await Transcriber.VOSK_MODELS.get(this.#loaded_modelpath[label]);
    }

    unloadModel(label: string) {
        delete this.#loaded_modelpath[label];
    }

    //

    close() {
        this.#wss?.shutDown();
        this.#wss = null;
        this.#closed = true;
    }

}

function getTranscriptionCallback(socket: WebSocket.connection, old_transcription_memory: Array<TranscriptionType | null>) {
    let cb = (transcription: TranscriptionType) => {
        if(
            ( transcription.partial != old_transcription_memory[0]?.partial
              || transcription.content != old_transcription_memory[0]?.content )
            &&
            ( transcription.partial || transcription.content.length > 0 )
        ) {
            socket.sendUTF(JSON.stringify(transcription));
            old_transcription_memory[0] = transcription
        }
    }
    return cb;
}