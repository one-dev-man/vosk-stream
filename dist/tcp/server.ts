import EventEmitter = require("events");
import net = require("net");
import DATA_TYPES from "./datatypes";

type VOSKSTREAM_TCP_SERVER_CLIENT_EVENTS = "data" | "string" | "buffer" | "close" | "error";

class VoskStreamTCPServerClient extends EventEmitter {

    //

    #socket: net.Socket;

    #closed = false;

    constructor(socket: net.Socket) {
        super();

        this.#socket = socket;

        this.#init();
    }

    //

    get socket() { return this.#socket; }

    get closed() { return this.#closed; }

    //

    #init = () => {
        let data = Buffer.from([]);
        let data_type_id: number | null = null;
        let data_length = -1;

        this.socket.on("data", (d) => {
            if(!(data.length < data_length)) {
                if(data_length > 0) {
                    this.emit("data", data);

                    let data_type = DATA_TYPES.getById(data_type_id);
                    if(data_type) {
                        try { this.emit(data_type.event as any, data_type.parse(data)); }
                        catch(e) { console.error(e); }
                    }
                }

                data_type_id = d.readUInt8(0);
                data_length = d.readUInt32BE(1);
                data = d.slice(5);
            }
            if(data.length < data_length) {
                data = Buffer.concat([data, d]);
            }
        });

        this.socket.on("close", () => {
            this.#closed = true;
            this.emit("close");
        });
    }

    //

    on(event: VOSKSTREAM_TCP_SERVER_CLIENT_EVENTS, callback: (...args: any[]) => void) { return super.on(event, callback); }

    once(event: VOSKSTREAM_TCP_SERVER_CLIENT_EVENTS, callback: (...args: any[]) => void) { return super.once(event, callback); }

    removeListener(event: VOSKSTREAM_TCP_SERVER_CLIENT_EVENTS, callback: (...args: any[]) => void) { return super.removeListener(event, callback); }

    removeAllListeners(event: VOSKSTREAM_TCP_SERVER_CLIENT_EVENTS) { return super.removeAllListeners(event); }

    off(event: VOSKSTREAM_TCP_SERVER_CLIENT_EVENTS, callback: (...args: any[]) => void) { return super.off(event, callback); }

    emit(event: VOSKSTREAM_TCP_SERVER_CLIENT_EVENTS, ...args: any) { return super.emit(event, ...args); }

    //

}

class VoskStreamTCPServer {

    #socket_server: net.Server;

    #clients = new Array<VoskStreamTCPServerClient>();

    constructor() {
        this.#socket_server = net.createServer((socket) => {
            let client = new VoskStreamTCPServerClient(socket);
            this.#clients.push(client);

            client.on("string", r => console.log(r));
        });
    }
    
}