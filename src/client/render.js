import { debounce } from 'throttle-debounce';
import { getAsset } from './assets';
import { getCurrentState } from './state';
import * as THREE from './three/build/three.js';
import { FBXLoader } from './three/examples/jsm/loaders/FBXLoader';
import { OBJLoader } from './three/examples/jsm/loaders/OBJLoader';
import { create, isUndefined } from 'lodash';
import { updateCamera } from './networking';
import { Ocean } from './three/examples/jsm/misc/Ocean';
import { Water } from './three/examples/jsm/objects/Water2'

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

var ocean;
var objectsInSceneStart;
var shipColor = getRandomColor();
var sailColor = 0xEFEFE9;

var oceanCount = 10;
function render() {
  const { me, others, cannonballs } = getCurrentState();
  if (!me) {
    return;
  }

  if (oceanCount <= 0) {
    updateOcean(me);
    oceanCount = 10;
  } else {
    oceanCount--;
  }

  updatePlayer(me, me);
  others.forEach(updatePlayer.bind(null, me));
  cannonballs.forEach(updateCannons.bind(null, me));
  updateCam(me);
  renderer.render(scene, camera);
  while (scene.children.length > objectsInSceneStart) {
    scene.remove(scene.children[scene.children.length - 1]);
  }
}

function init() {
  loadWarship();
  loadLargeShip();
}

function createHealthBar(x, y, z, health, camX, camHeight, camZ) {
  var geometry = new THREE.PlaneGeometry( 17, 3, 1 );
  var material = new THREE.MeshBasicMaterial( {color: 0x52130B, side: THREE.DoubleSide} );
  var background = new THREE.Mesh( geometry, material );
  scene.add( background );
  background.position.set(x, y+35, z);
  background.lookAt(camX, camHeight, camZ);
  background.translateZ(-0.1);
  var geometry = new THREE.PlaneGeometry( health/100.0 * 15, 2, 1 );
  var material = new THREE.MeshBasicMaterial( {color: 0x30dd22, side: THREE.DoubleSide} );
  var hp = new THREE.Mesh( geometry, material );
  scene.add( hp );
  hp.position.set(x, y+35, z);
  hp.lookAt(camX, camHeight, camZ);
}

function updatePlayer(me, player) {
  const {x, y, z, angleY, angleX, angleZ, health} = player;
  const {camX, camHeight, camZ} = me;
  createWarship(x, y, z, angleX, angleY, angleZ);
  createHealthBar(x, y, z, health, camX, camHeight, camZ);
}

function updateCannons(me, cannon) {
  const {x, y, z, radius} = cannon;
  var geometry = new THREE.SphereGeometry( radius, 5, 5 );
  var material = new THREE.MeshBasicMaterial( {color: 0xb02f2a} );
  var sphere = new THREE.Mesh( geometry, material );
  scene.add( sphere );
  sphere.position.set(x, y, z);
}

function updateCam(me) {
  const {x, z, camX, camHeight, camZ} = me;
  camera.position.set(camX, camHeight, camZ);
  camera.lookAt(x, 0, z);
}

function createScene() {
  renderer.setSize(window.innerWidth, window.innerHeight - 32);
  document.body.appendChild(renderer.domElement);
  canvas.style.cursor = 'none';
  var geometry = new THREE.PlaneGeometry( 100, 100, 32 );
  var material = new THREE.MeshLambertMaterial( {color: 0x1873e7, side: THREE.DoubleSide} );
  var plane = new THREE.Mesh( geometry, material );
  plane.position.set(0, -2, 0);
  plane.rotation.set(Math.PI/2, 0, 0);
  var light = new THREE.HemisphereLight( 0xf9f9f9, 0x080820, 1 );
  scene.add( light );
  createOcean();
  scene.background = new THREE.Color( 0x1ecbe1 );
  light = new THREE.DirectionalLight(0xffffff, 1.0);
  light.position.set(0, 100, 0);
  scene.add(light);
  objectsInSceneStart = scene.children.length-1;
}

var largeShip = [];
function loadLargeShip() {
  var loader = new OBJLoader();
	loader.load( '/assets/OBJ/SM_Veh_Veh_Boat_Large_01_Hull_Pirate.obj', function ( object ) {
    object.name = "hull";
    object.children[0].material.color.set(shipColor);
    largeShip.push(object);
  });
  loader.load( '/assets/OBJ/SM_Veh_Boat_Large_Mast_01_Pirate.obj', function ( object ) {
    object.name = "mast1";
    object.children[0].material.color.set(shipColor);
    largeShip.push(object);
  });
  loader.load( '/assets/OBJ/SM_Veh_Boat_Large_Mast_02_Pirate.obj', function ( object ) {
    object.name = "mast2";
    object.children[0].material.color.set(shipColor);
    largeShip.push(object);
  });
  loader.load( '/assets/OBJ/SM_Veh_Boat_Large_Sails_01_Pirate.obj', function ( object ) {
    object.name = "sails1";
    object.children[0].material.color.set(sailColor);
    largeShip.push(object);
  });
  loader.load( '/assets/OBJ/SM_Veh_Boat_Large_Sails_02_Pirate.obj', function ( object ) {
    object.name = "sails2";
    object.children[0].material.color.set(sailColor);
    largeShip.push(object);
  });
  loader.load( '/assets/OBJ/SM_Veh_Boat_Large_Sails_03_Pirate.obj', function ( object ) {
    object.name = "sails3";
    object.children[0].material.color.set(sailColor);
    largeShip.push(object);
  });
}

function createLargeShip(x, y, z, angleX, angleY, angleZ) {
  largeShip.forEach(index => {
    var curr = index.clone();
    curr.rotation.x = angleX;
    curr.rotation.y = angleY;
    curr.rotation.z = angleZ;
    if (curr.name === "hull") { 
      curr.position.set(x, y+2, z);
    } else if (curr.name === "mast1") {
      curr.position.set(x, y+4, z);
      curr.translateZ(10);
    } else if (curr.name === "mast2") {
      curr.position.set(x, y+4, z);
    } else if (curr.name === "mast3") {
      curr.position.set(x, y+4, z);
      curr.translateZ(-12);
    } else if (curr.name === "sails1") {
      curr.position.set(x, y+8, z);
      curr.translateZ(10);
    } else if (curr.name === "sails2") {
      curr.position.set(x, y+6, z);
    } else if (curr.name === "sails3") {
      curr.position.set(x, y+11, z);
      curr.translateZ(-12);
    }
    scene.add(curr);
  });
}

var warship = [];
function loadWarship() {
  var loader = new OBJLoader();
	loader.load( '/assets/OBJ/SM_Veh_Boat_Warship_01_Hull_Pirate.obj', function ( object ) {
    object.name = "hull";
    object.children[0].material.color.set(shipColor);
    warship.push(object);
  });
  loader.load("/assets/OBJ/SM_Veh_Boat_Warship_01_Mast_01_Pirate.obj", function (object) {
    object.name = "mast1";
    object.children[0].material.color.set(shipColor);
    warship.push(object);
  });
  loader.load("/assets/OBJ/SM_Veh_Boat_Warship_01_Mast_02_Pirate.obj", function (object) {
    object.name = "mast2";
    object.children[0].material.color.set(shipColor);
    warship.push(object);
  });
  loader.load("/assets/OBJ/SM_Veh_Boat_Warship_01_Mast_03_Pirate.obj", function (object) {
    object.name = "mast3";
    object.children[0].material.color.set(shipColor);
    warship.push(object);
  });
  loader.load("/assets/OBJ/SM_Veh_Boat_Warship_01_Sails_01_Pirate.obj", function (object) {
    object.name = "sails1";
    object.children[0].material.color.set(sailColor);
    warship.push(object);
  });
  loader.load("/assets/OBJ/SM_Veh_Boat_Warship_01_Sails_02_Pirate.obj", function (object) {
    object.name = "sails2";
    object.children[0].material.color.set(sailColor);
    warship.push(object);
  });
  loader.load("/assets/OBJ/SM_Veh_Boat_Warship_01_Sails_03_Pirate.obj", function (object) {
    object.name = "sails3";
    object.children[0].material.color.set(sailColor);
    warship.push(object);
  });
}

function createWarship(x, y, z, angleX, angleY, angleZ) {
  warship.forEach(index => {
    var curr = index.clone();
    curr.rotation.x = angleX;
    curr.rotation.y = angleY;
    curr.rotation.z = angleZ;
    if (curr.name === "hull") { 
      curr.position.set(x, y, z)
    } else if (curr.name === "mast1") {
      curr.position.set(x, y+8, z);
      curr.translateZ(10);
    } else if (curr.name === "mast2") {
      curr.position.set(x, y+6, z);
    } else if (curr.name === "mast3") {
      curr.position.set(x, y+11, z);
      curr.translateZ(-12);
    } else if (curr.name === "sails1") {
      curr.position.set(x, y+8, z);
      curr.translateZ(10);
    } else if (curr.name === "sails2") {
      curr.position.set(x, y+6, z);
    } else if (curr.name === "sails3") {
      curr.position.set(x, y+11, z);
      curr.translateZ(-12);
    }
    scene.add(curr);
  });
}

function renderMainMenu() {
  const t = Date.now() / 7500;
  const x = MAP_SIZE / 2 + 800 * Math.cos(t);
  const y = MAP_SIZE / 2 + 800 * Math.sin(t);
}

function createOcean() {
  var gsize = 800;
  var res = 1024;
  var gres = res / 2;
  var origx = 0;
  var origz = 0;
  ocean = new Ocean( renderer, camera, scene,
    {
      USE_HALF_FLOAT: false,
      INITIAL_SIZE: 2000.0,
      INITIAL_WIND: [ 10.0, 10.0 ],
      INITIAL_CHOPPINESS: 0.5,
      CLEAR_COLOR: [ 1.0, 1.0, 1.0, 0.0 ],
      GEOMETRY_ORIGIN: [ origx, origz ],
      SUN_DIRECTION: [ - 1.0, 1.0, 1.0 ],
      OCEAN_COLOR: new THREE.Vector3( 0.004, 0.016, 0.047 ),
      SKY_COLOR: new THREE.Vector3( 3.2, 9.6, 12.8 ),
      EXPOSURE: 0.35,
      GEOMETRY_RESOLUTION: gres,
      GEOMETRY_SIZE: gsize,
      RESOLUTION: res
    } );

  ocean.materialOcean.uniforms[ "u_projectionMatrix" ] = { value: camera.projectionMatrix };
  ocean.materialOcean.uniforms[ "u_viewMatrix" ] = { value: camera.matrixWorldInverse };
  ocean.materialOcean.uniforms[ "u_cameraPosition" ] = { value: camera.position };
  scene.add(ocean.oceanMesh);
}

var lastTime = (new Date()).getTime();
function updateOcean(me) {
  var currentTime = new Date().getTime();
  ocean.deltaTime = ( currentTime - lastTime ) / 1000 || 0.0;
  lastTime = currentTime;
  ocean.render( ocean.deltaTime );
  ocean.overrideMaterial = ocean.materialOcean;

  ocean.materialOcean.uniforms[ "u_normalMap" ].value = ocean.normalMapFramebuffer.texture;
  ocean.materialOcean.uniforms[ "u_displacementMap" ].value = ocean.displacementMapFramebuffer.texture;
  ocean.materialOcean.uniforms[ "u_projectionMatrix" ].value = camera.projectionMatrix;
  ocean.materialOcean.uniforms[ "u_viewMatrix" ].value = camera.matrixWorldInverse;
  ocean.materialOcean.uniforms[ "u_cameraPosition" ].value = camera.position;
  ocean.materialOcean.depthTest = true;
}

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

let renderInterval = setInterval(renderMainMenu, 1000 / 60);

// Replaces main menu rendering with game rendering.
export function startRendering() {
  clearInterval(renderInterval);
  init();
  renderInterval = setInterval(render, 1000 / 60);
}

// Replaces game rendering with main menu rendering.
export function stopRendering() {
  clearInterval(renderInterval);
  renderInterval = setInterval(renderMainMenu, 1000 / 60);
}