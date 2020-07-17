// Eric Bollar

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.outerWidth, window.outerHeight - 32);
document.body.appendChild(renderer.domElement);
var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 500);
var scene = new THREE.Scene();

camera.position.set(0, 0, -10);
camera.lookAt(0, 0, 0);

var geometry = new THREE.BoxGeometry( 1, 1, 1 );
var material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
var cube = new THREE.Mesh( geometry, material );
scene.add( cube );

render();

function render() {
    renderer.render(scene, camera);
}