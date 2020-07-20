import { debounce } from 'throttle-debounce';
import { getAsset } from './assets';
import { getCurrentState } from './state';
import * as THREE from './js/three.js';

const Constants = require('../shared/constants');

const { PLAYER_RADIUS, PLAYER_MAX_HP, BULLET_RADIUS, MAP_SIZE } = Constants;

// Get the canvas graphics context
const canvas = document.getElementById('game-canvas');
setCanvasDimensions();
var renderer = new THREE.WebGLRenderer({canvas});
renderer.setSize(window.innerWidth, window.innerHeight - 32);
document.body.appendChild(renderer.domElement);
var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 500);
var scene = new THREE.Scene();
createScene();

function setCanvasDimensions() {
  // On small screens (e.g. phones), we want to "zoom out" so players can still see at least
  // 800 in-game units of width.
  const scaleRatio = Math.max(1, 800 / window.innerWidth);
  canvas.width = scaleRatio * window.innerWidth;
  canvas.height = scaleRatio * window.innerHeight;
}

window.addEventListener('resize', debounce(40, setCanvasDimensions));

function render() {
  const { me, others, bullets } = getCurrentState();
  if (!me) {
    return;
  }

  // Draw background
  //renderScene();

  // Draw all bullets
  //bullets.forEach(renderBullet.bind(null, me));

  renderPlayer(me, me);
  others.forEach(renderPlayer.bind(null, me));
}

function createScene() {
  camera.position.set(-10, 10, 0);
  camera.lookAt(0, 0, 0);
  var geometry = new THREE.PlaneGeometry( 100, 100, 32 );
  var material = new THREE.MeshLambertMaterial( {color: 0x1873e7, side: THREE.DoubleSide} );
  var plane = new THREE.Mesh( geometry, material );
  plane.position.set(0, 0, 1);
  plane.rotation.set(Math.PI/2, 0, 0);
  scene.add( plane );
  var light = new THREE.HemisphereLight( 0x1ecbe1, 0x080820, 1 );
  scene.add( light );
}

// Renders a ship at the given coordinates
function renderPlayer(me, player) {
  if (!scene.getObjectByName(player.id)) {
    var geometry = new THREE.BoxGeometry(1, 1, 1);
    var material = new THREE.MeshLambertMaterial({ color: 0x00ff00 });
    var cube = new THREE.Mesh(geometry, material);
    cube.name = "" + player.id;
    cube.position.set(0, 1, 0);
    scene.add(cube);
  }
  var cube = scene.getObjectByName("" + player.id);
  const { x, z, angle, camX, camZ, camHeight } = player;
  cube.rotation.y = angle;
  cube.translateZ(0.01);
  camera.position.set(camX + cube.position.x, camHeight, camZ + cube.position.z);
  camera.lookAt(cube.position);
  renderer.render(scene, camera);
}

function renderMainMenu() {
  const t = Date.now() / 7500;
  const x = MAP_SIZE / 2 + 800 * Math.cos(t);
  const y = MAP_SIZE / 2 + 800 * Math.sin(t);
}

let renderInterval = setInterval(renderMainMenu, 1000 / 60);

// Replaces main menu rendering with game rendering.
export function startRendering() {
  clearInterval(renderInterval);
  renderInterval = setInterval(render, 1000 / 60);
}

// Replaces game rendering with main menu rendering.
export function stopRendering() {
  clearInterval(renderInterval);
  renderInterval = setInterval(renderMainMenu, 1000 / 60);
}
