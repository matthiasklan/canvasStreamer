import CanvasStreamerClient from '../canvasStreamerClient';

var client = new CanvasStreamerClient('output_image');
client.emitter.on('error', (error) => {
  console.error(error);
});
client.emitter.on('closed', () => {
  console.warning('connection closed');
});

var serverId = prompt('enter server id');
if(serverId){
  client.init({key: 'jlu5rpiwwswnrk9', serverId: serverId}).then(() => {
    console.log('connected to Server');
  }).catch((error) =>{
    console.error(error);
  });
}
