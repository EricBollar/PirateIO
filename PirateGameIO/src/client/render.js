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
  renderScene();

  // Draw all bullets
  //bullets.forEach(renderBullet.bind(null, me));

  renderPlayer(me, me);
  others.forEach(renderPlayer.bind(null, me));
}

function renderScene() {
  renderer.render(scene, camera);
}

function createScene() {
  camera.position.set(-10, 10, 0);
  camera.lookAt(0, 0, 0);
  var geometry = new THREE.PlaneGeometry( 100, 100, 32 );
  var material = new THREE.MeshLambertMaterial( {color: 0x1873e7, side: THREE.DoubleSide} );
  var plane = new THREE.Mesh( geometry, material );
  plane.position.set(0, 0, 1);
  plane.rotation.set(0, 0, 0);
  scene.add( plane );
  var light = new THREE.HemisphereLight( 0x1ecbe1, 0x080820, 1 );
  scene.add( light );
}

// Renders a ship at the given coordinates
function renderPlayer(me, player) {
  var geometry;
  var material;
  var cube;
  if (!scene.getObjectById(player.id)) {
    geometry = new THREE.BoxGeometry(1, 1, 1);
    material = new THREE.MeshLambertMaterial({ color: 0x00ff00 });
    cube = new THREE.Mesh(geometry, material);
    cube.id = player.id;
    scene.add(cube);
  } else {
    cube = scene.getObjectById(player.id);
  }

  const { x, y, angle } = player;
  console.log(angle * 180 / Math.PI);
  cube.rotation.y = angle;
}

function renderBullet(me, bullet) {
  const { x, y } = bullet;
  context.drawImage(
    getAsset('bullet.svg'),
    canvas.width / 2 + x - me.x - BULLET_RADIUS,
    canvas.height / 2 + y - me.y - BULLET_RADIUS,
    BULLET_RADIUS * 2,
    BULLET_RADIUS * 2,
  );
}

function renderMainMenu() {
  const t = Date.now() / 7500;
  const x = MAP_SIZE / 2 + 800 * Math.cos(t);
  const y = MAP_SIZE / 2 + 800 * Math.sin(t);
  renderScene();
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
