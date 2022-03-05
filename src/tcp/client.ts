import net = require("net");
import DATA_TYPES from "./datatypes";

class VoskStreamTCPClient {

    #socket: net.Socket | null = null;

    constructor() {
        
    }

    //

    get socket() { return this.#socket; }

    //

    connect(options: { ip: string, port: number }) {
        this.#socket = net.connect(options.port, options.ip);

        this.socket?.on("data", (d) => {

        });
    }

    //

    #send = (data: object | string | Buffer) => {
        let data_type = DATA_TYPES.getByInput(data);

        this.socket?.write(data_type?.pack(data));
    }

}