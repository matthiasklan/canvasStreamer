# canvasStreamer
streams a canvas from one peer to another via webRTC and peerjs. You can use this to stream webGL apps and control them via keyevents. (see demo)

## Install

First get the two js files from the build folder and import them. For example with ES6 or the old fashion `<script>` way

Server:
```javascript
import CanvasStreamerServer from 'path/to/canvasStreamerServer';
```

Client:
```javascript
import CanvasStreamerClient from 'path/to/canvasStreamerClient';
```

## Usage

### Server

create a new server object and provide the dom id of your canvas, you want to stream. in the second options parameter you can disable the renderig of the canvas on the server. This can be useful when you are streaming a webgl canvas, because you will gain some more speed. Additionally you can add the a decimal parameter `compression` (0-1), `frameskip` and `mimeType` (`"image/jpeg", "image/png", "image/webp"`) The defailt values are `mimeType = "image/jpeg", compression = 0.5, frameskip = 1`

```javascript
const server = new CanvasStreamerServer('canvas', {hideCanvas : true});
```

the next step is to initiate the connection. Call the `init` method and provide a cloud api key from [peerjs.com](http://peerjs.com/peerserver) or you can add the `host`, `port`, `path` and `secure` values of your own peer server. For more info go to https://github.com/peers/peerjs-server

```javascript
server.init({key: 'yourAPIkey'}).then((id) => {
  console.log('this is you server id', id);
});
```

or

```javascript
server.init({host: 'yourHostIP', port: 1337, path: '/peer', secure: true}).then((id) => {
  console.log('this is you server id', id);
});
```

the promise will return your server id. You will need to pass this id to your client.

The server is able to listen to several events, such as `connected`, `error`, `closed` and `clientKeyUp`:

```javascript
server.on('connected', (clientId) => {
  console.log('connected to Client:', clientId);
});
server.on('error', (error) => {
  console.error(error);
});
server.on('closed', () => {
  console.warn('connection closed');
});
server.on('clientKeyUp', (key) => {
  console.log('Client pressed key:', key);
});
```

If you want to stream the canvas you call the `stream` method. You can hook this method for example into your game loop, to stream webGL apps.

```javascript
server.stream();
```

### Client

create a new client object and provide the dom id of your image tag, where you want to project the streamed canvas.

```javascript
var client = new CanvasStreamerClient('output_image');
```

the next step is to initiate the connection. Call the `init` method and provide the same cloud api key from [peerjs.com](http://peerjs.com/peerserver) or your own peer server options. additionally pass the server's peer id.

```javascript
client.init({key: 'yourAPIkey', serverId: 'serversPeerId'}).then(() => {
  console.log('connected to Server');
});
```

or

```javascript
client.init({host: 'yourHostIP', port: 1337, path: '/peer', secure: true, serverId: 'serversPeerId' }).then(() => {
  console.log('connected to Server');
});
```

The client is able to listen to two events, `error`, and `closed`:

```javascript
client.on('error', (error) => {
  console.error(error);
});
client.on('closed', () => {
  console.warn('connection closed');
});
```

the pressed keys on the client will be transmitted to the server.

## ToDo, Hints, Bugs, ...

- you can look at the demo source code for a better understanding
- maybe transmit Mouse events
- only key up events are available, because key down would cause lags on webGL apps. maybe this can be solved with webworkers.

## Demo

> __Warning:__ The deployed demo is not working anymore, because the peerjs cloud does not support tls connections and the github pages ist switched to enforcing https connections.

Here is a demo of streaming a three.js canvas:

open the [Server](http://mklan.github.io/canvasStreamer/Server/) and copy the peer id. Now
open the [Client](http://maklan.github.io/canvasStreamer/Client/) in a complete new window (not only tab!) or another device and enter the peer id.

You can control the cube with `a` and `w`.
