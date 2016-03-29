import CanvasStreamerServer from '../canvasStreamerServer';

import THREE from 'three';

var server = new CanvasStreamerServer('canvas', {hideCanvas : true});
server.on('connected', (clientId) => {
  console.log('connected to Client:', clientId);
});
server.on('error', (error) => {
  console.error(error);
});
server.on('closed', () => {
  console.warning('connection closed');
});
server.on('clientKeyUp', (key) => {
  if(key === '68'){ //w
    cube.position.x = cube.position.x+1;
  }
  if(key === '65'){ //a
    cube.position.x = cube.position.x-1;
  }
});
server.init({key: 'jlu5rpiwwswnrk9'}).then((id) => {
  prompt('copy this id to your client', id);
});


//three.js demo
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );


var renderer = new THREE.WebGLRenderer( { canvas: document.getElementById('canvas') } );
renderer.setSize( 720, 480 );
document.body.appendChild( renderer.domElement );

var geometry = new THREE.BoxGeometry( 1, 1, 1 );
var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
var cube = new THREE.Mesh( geometry, material );
scene.add( cube );

camera.position.z = 5;

var render = function () {
  requestAnimationFrame( render );

  cube.rotation.x += 0.1;
  cube.rotation.y += 0.1;

  renderer.render(scene, camera);
  server.stream(); //here you stream the current Frame to te client
};

render();
