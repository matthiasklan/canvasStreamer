import PeerClient from './PeerClient';

export default class CanvasStreamerServer extends PeerClient {

  constructor(canvasId, {
    mimeType = "image/jpeg",
    compression = 0.5,
    frameskip = 1,
    hideCanvas = false //you can gain faster framerates, if you disable canvasDrawing on the Server
  } = {}) {
    super();
    this.canvas = document.getElementById(canvasId);

    if(hideCanvas){
      this.canvas.style.display = 'none';
    }

    this.mimeType = mimeType; //"image/png" "image/webp";
    this.compression = compression;
    this.frameskip = frameskip < 1 ? 1 : frameskip;

    this.framecounter = 0;


  }

  handleData(data) {
    data = data + ''; //to String
    var parts, value;
    if (data.startsWith('5cfb10f9fc38fb_')) { //if the id gets transmitted
      parts = data.split("_");
      value = parts[1];
      this.connect(value).then(() => {
        this.emitter.emit('connected', value);
      });
    } else if (data.startsWith('kp_')) { //if keyPress
      parts = data.split("_");
      value = parts[1];
      this.emitter.emit('clientKeyPress', value);
    } else if (data.startsWith('ku_')) { //if keyUp
      parts = data.split("_");
      value = parts[1];
      this.emitter.emit('clientKeyUp', value);
    } else if (data.startsWith('kd_')) { //if keyDown
      parts = data.split("_");
      value = parts[1];
      this.emitter.emit('clientKeyDown', value);
    } else {
      console.log(data);
    }
  }

  stream() {
    this.framecounter++;
    if (this.framecounter % this.frameskip === 0) {
      super.send(this.canvas.toDataURL(this.mimeType, this.compression));
      this.framecounter = 0;
    }
  }

}
