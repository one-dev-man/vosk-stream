# Vosk Stream

Vosk Stream is a NodeJS package using NodeJS Vosk API and FFMPEG to transcribe in real time audio data using a pre-trained model for Vosk API (see the [vosk model list](https://alphacephei.com/vosk/models)).

## Installing

To install and use this package, type :

```bash
npm install vosk-stream
```

After, you can import it in typescript :

```typescript
import VoskStream from "vosk-stream";
```

Or in vanilla JavaScript :
```javascript
const VoskStream = require("vosk-stream").default;
```

## Usage

Vosk Stream implements two type of stream server and client : TCP and WebSocket

### TCP Server/Client

(under development)

### WebSocket Server/Client

If you need to use Vosk on a website, you can use the WebSocket client.

First, you need to setup the server :
```typescript
/* |------------|
 * | TypeScript |
 * |------------|
 */

import net = require("net");

import VoskStream from "vosk-stream";

// Setup HTTP Server :

let http_server = net.createServer((request, response) => {
    // To-Do
});

http_server.listen(1234);

// Setup Vosk Stream WebSocket server :

let model_path: string; // Your Vosk model directory path

let transcription_server = new VoskStream.WebSocket.Server({ httpServer: http_server });

transcription_server.loadModel("en", model_path) // You need to specify a label to your model (here: "en") for to use it later with the client

transcription_server.open();

```
&nbsp;
```typescript
/* |------------|
 * | JavaScript |
 * |------------|
 */

const net = require("net");

const VoskStream = require("vosk-stream").default;

// Setup HTTP Server :

let http_server = net.createServer((request, response) => {
    // To-Do
});

http_server.listen(1234);

// Setup Vosk Stream WebSocket server :

let model_path; // Your Vosk model directory path

let transcription_server = new VoskStream.WebSocket.Server({ httpServer: http_server });

transcription_server.loadModel("en", model_path) // You need to specify a label to your model (here: "en") for to use it later with the client

transcription_server.open();

```