import { debounce } from 'throttle-debounce';
import { getAsset } from './assets';
import { getCurrentState } from './state';
import * as THREE from './three/build/three.js';
import { OBJLoader } from './three/examples/jsm/loaders/OBJLoader';
import { MTLLoader } from './three/examples/jsm/loaders/MTLLoader';
import { create, isUndefined } from 'lodash';
import { updateCamera } from './networking';

const Constants = require('../shared/constants');

const { PLAYER_RADIUS, PLAYER_MAX_HP, BULLET_RADIUS, MAP_SIZE } = Constants;

// Get the canvas graphics context
const canvas = document.getElementById('game-canvas');
setCanvasDimensions();
var scene = new THREE.Scene();
var renderer = new THREE.WebGLRenderer({canvas});
var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 500);;
createScene();

function setCanvasDimensions() {
  // On small screens (e.g. phones), we want to "zoom out" so players can still see at least
  // 800 in-game units of width.
  const scaleRatio = Math.max(1, 800 / window.innerWidth);
  canvas.width = scaleRatio * window.innerWidth;
  canvas.height = scaleRatio * window.innerHeight;
}

window.addEventListener('resize', debounce(40, setCanvasDimensions));

var newShip;
var shipModel;

function render() {
  const { me, others } = getCurrentState();
  if (!me) {
    return;
  }

  if (newShip) {
    loadShip();
    newShip = false;
  }

  updatePlayer(me, me);
  others.forEach(updatePlayer.bind(null, me));
  updateCam(me);
  renderer.render(scene, camera);
  while (scene.children.length > 2) {
    scene.remove(scene.children[scene.children.length - 1]);
  }
}

function updateCam(me) {
  const {x, z, camX, camHeight, camZ} = me;
  camera.position.set(camX, camHeight, camZ);
  camera.lookAt(x, 0, z);
}

function loadShip() {
  var mtlloader = new MTLLoader();
  var objloader = new OBJLoader();
  mtlloader.load("/assets/ship.mtl", function (materials) {
    materials.preload();
    objloader.setMaterials(materials);
    objloader.load("/assets/ship.obj", function (object) {
      object.scale.set(0.1, 0.1, 0.1);
      shipModel = object;
    });
  })
}

function createScene() {
  renderer.setSize(window.innerWidth, window.innerHeight - 32);
  document.body.appendChild(renderer.domElement);
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

function updatePlayer(me, player) {
  const {id, x, z, angleY, angleZ, created} = player;
  var cube = new THREE.Mesh();
  cube = shipModel.clone();
  scene.add(cube);
  cube.position.set(x, 0, z);
  cube.rotation.y = angleY;
  cube.rotation.z = angleZ;
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
  newShip = true;
  renderInterval = setInterval(render, 1000 / 60);
}

// Replaces game rendering with main menu rendering.
export function stopRendering() {
  clearInterval(renderInterval);
  renderInterval = setInterval(renderMainMenu, 1000 / 60);
}