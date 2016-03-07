import Peer from 'peerjs';
import ee from 'event-emitter';

export default class PeerClient {

  constructor() {
    this.emitter = ee({});
  }

  init({
    host,
    port,
    path,
    secure = false,
    key
  } = {}) {
    return new Promise((resolve, reject) => {
      if (key) {
        this.peer = new Peer({
          key: key
        });
      } else {
        this.peer = new Peer({
          host: host,
          port: port,
          path: path,
          secure: secure
        });
      }

      this.peer.on('open', (id) => {
        this.peerId = id;
        resolve(id);
      });
      this.peer.on('connection', (connection) => {
        //Message incoming
        connection.on('data', (data) => {
          this.handleData(data);
        });
        connection.on('close', () => {
            this.connection = null;
            this.emitter.emit('closed');
        });
        connection.on('error', (error) => {
          this.connection = null;
          this.emitter.emit('error', error);
        });
      });
      this.peer.on('error', (error) => {
        this.connection = null;
        this.emitter.emit('error', error);
      });
    });
  }

  handleData(data) {
    console.log('unhandled data', data);
  }

  connect(id) {
    return new Promise((resolve, reject) => {
      var connection = this.peer.connect(id);
      connection.on('open', () => {
          this.connection = connection;
          resolve();
      });
      connection.on('error', (error) => {
        this.emitter.emit('error', error);
      });
    });
  }

  send(message) {
    if (this.connection) {
        this.connection.send(message);
    }
  }
}
