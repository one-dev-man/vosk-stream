# Vosk Stream

Vosk Stream is a NodeJS package using NodeJS Vosk API and FFMPEG to transcribe in real time audio data using a pre-trained model for Vosk API (see the [`vosk model list`](https://alphacephei.com/vosk/models)).

## I - Installing

```bash
# npm
> npm install vosk-stream

# yarn
> yarn install vosk-stream
```


Import :
```js
// ES5 (NodeJS)
const VoskStream = require("vosk-stream").default;
```

```js
// ES6 (TypeScript)
import VoskStream from "vosk-stream";
```

## II - Usage

&nbsp;

- ### WebSocket Server/Client

The WebSocket implementation is powerful to use for web apps if you need to transcribe directly from a web page and you won't have a local transcription service on devices.

First, setup server :
```js
// ES5

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
Or
```js
// ES6

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

Then, use client for browser (from [`dist-bundles`](https://github.com/one-dev-man/vosk-stream/blob/main/dist-bundles/)):
```html
<script type="application/javascript" src="https://raw.githubusercontent.com/one-dev-man/vosk-stream/main/dist-bundles/voskstream.client.web.min.js"></script>

<script>
    (async () => {
        let tc = new VoskStream.Client("ws://localhost:1234/");
        await tc.open(); // Open WebSocket connection and wait

        tc.setLangModel("en"); // Define the lang model to use through his label defined in server setup

        tc.on("transcription", (transcription) => { // transcription: { partial: boolean, content: string }
            console.log(transcription) // Log transcription result.
        }); 

        tc.startRecording(); // Record microphone an transcribe audio stream
    })();
</script>

```

&nbsp;

- ### TCP Server/Client

(under development)