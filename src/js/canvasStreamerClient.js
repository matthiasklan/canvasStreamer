import PeerClient from './PeerClient';


export default class CanvasStreamerClient extends PeerClient {

  constructor(output_dest) {
    super();
    this.output = document.getElementById(output_dest);

    window.onkeyup = (e) => {
      var key = e.keyCode ? e.keyCode : e.which;
      this.sendKeyboardCommand('ku', key);
    };
    // key down slows server down (web worker ?!?!)
    // window.onkeydown = (e) => {
    //   var key = e.keyCode ? e.keyCode : e.which;
    //   this.sendKeyboardCommand('kd', key);
    // };
    // key press slows server down (web worker ?!?!)
    // window.onkeypress = (e) => {
    //   var key = e.keyCode ? e.keyCode : e.which;
    //   this.sendKeyboardCommand('kp', key);
    // };
  }

  init({host, port, path, secure, key=null, serverId} = {}){
    if(!serverId) return Promise.reject('no ServerId provided');
    return super.init({host: host, port: port, path: path, secure: secure, key: key}).then((myId) =>{
      return this.connect(myId, serverId);
    }).catch((error) => {
      return Promise.reject(error);
    });
  }

  connect(myId, serverId) {
    return super.connect(serverId).then(() => {
        super.send('5cfb10f9fc38fb_' + myId); //transmit own id
    }).catch((error) => {
      return Promise.reject(error);
    });
  }

  sendKeyboardCommand(type,key) {
        if(type !== 'kp' && type !== 'ku' && type !== 'kd') return;
        super.send(type + '_' + key); //key
  }

  handleData(data) {
    if (data.startsWith('data:')) {
      this.output.src = data; //Append to Image-Tag
    } else {
      console.log(data);
    }
  }

}
