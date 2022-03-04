import net = require("net");

class VoskStreamTCPServer {

    #socket_server: net.Server;

    constructor() {
        this.#socket_server = net.createServer((socket) => {
            
        });
    }
    
}