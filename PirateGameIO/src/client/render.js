import { debounce } from 'throttle-debounce';
import { getAsset } from './assets';
import { getCurrentState } from './state';
import * as THREE from './three/build/three.js';
import { OBJLoader } from './three/examples/jsm/loaders/OBJLoader';
import { MTLLoader } from './three/examples/jsm/loaders/MTLLoader';
import { create } from 'lodash';

const Constants = require('../shared/constants');

const { PLAYER_RADIUS, PLAYER_MAX_HP, BULLET_RADIUS, MAP_SIZE } = Constants;

// Get the canvas graphics context
const canvas = document.getElementById('game-canvas');
setCanvasDimensions();
var scene = new THREE.Scene();
var renderer = new THREE.WebGLRenderer({canvas});
renderer.setSize(window.innerWidth, window.innerHeight - 32);
document.body.appendChild(renderer.domElement);
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

  // Draw all bullets
  //bullets.forEach(renderBullet.bind(null, me));

  renderPlayer(me, me);
  others.forEach(renderPlayer.bind(null, me));
}

function createScene() {
  var keylight = new THREE.DirectionalLight(new THREE.Color('hsl(30, 100%, 75%)'), 1.0);
  keylight.position.set(-100, 0, 100);
  scene.add(keylight);
  canvas.style.cursor = 'none';
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
  const { id, x, z, angle, camX, camZ, camHeight } = player;
  console.log(id);
  var ship;
  if (scene.getObjectByName("" + id) === undefined) {
    var mtlloader = new MTLLoader();
    mtlloader.load("/assets/ship.mtl", function (materials) {
      materials.preload();
      var objloader = new OBJLoader();
      objloader.setMaterials(materials);
      objloader.load("/assets/ship.obj", function (object) {
        object.scale.set(0.1, 0.1, 0.1);
        object.name = "" + id;
        scene.add(object);
        ship = object;
      });
    })
  }
  ship = scene.getObjectByName("" + id);
  ship.position.set(x, 1, z);
  ship.rotation.y = angle;
  var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 500);
  camera.position.set(camX, camHeight, camZ);
  camera.lookAt(ship.position);
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
