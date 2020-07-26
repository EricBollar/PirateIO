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
var sailColor = 0xEFEFE9;

var oceanCount = 10;
function render() {
  canvas.style.cursor = 'none';
  const { me, others, cannonballs } = getCurrentState();
  if (!me) {
    return;
  }

  if (oceanCount <= 0) {
    updateOcean(me);
    oceanCount = 5;
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
  loadMediumShip();
  loadSmallShip();
  loadBomb();
}

function createHealthBar(x, y, z, health, camX, camHeight, camZ, scale) {
  var geometry = new THREE.PlaneGeometry( scale*16.5, 3.5*scale, 1 );
  var material = new THREE.MeshBasicMaterial( {color: 0x52130B, side: THREE.DoubleSide} );
  var background = new THREE.Mesh( geometry, material );
  scene.add( background );
  background.position.set(x, y+35*scale, z);
  background.lookAt(camX, camHeight, camZ);
  background.translateZ(-0.1);
  var geometry = new THREE.PlaneGeometry( health/100.0 * scale*15, 2*scale, 1 );
  var material = new THREE.MeshBasicMaterial( {color: 0x30dd22, side: THREE.DoubleSide} );
  var hp = new THREE.Mesh( geometry, material );
  scene.add( hp );
  hp.position.set(x, y+35*scale, z);
  hp.lookAt(camX, camHeight, camZ);
}

function updatePlayer(me, player) {
  const {x, y, z, angleY, angleX, angleZ, health, color, username, ship, scale} = player;
  const {camX, camHeight, camZ} = me;
  switch (ship) {
    case 0: createSmallShip(x, y, z, angleX, angleY, angleZ, color, scale); break;
    case 1: createMediumShip(x, y, z, angleX, angleY, angleZ, color, scale); break;
    case 2: createLargeShip(x, y, z, angleX, angleY, angleZ, color, scale); break;
    case 3: createWarship(x, y, z, angleX, angleY, angleZ, color, scale); break;
  }
  createHealthBar(x, y, z, health, camX, camHeight, camZ, scale);
  createLabel(x, y, z, " " + username.substring(0, username.length - 3) + " ", camX, camHeight, camZ, scale);
}

function updateCam(me) {
  const {x, z, camX, camHeight, camZ} = me;
  camera.position.set(camX, camHeight, camZ);
  camera.lookAt(x, 0, z);
}

function createScene() {
  camera.far = 3000;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight - 32);
  document.body.appendChild(renderer.domElement);
  canvas.style.cursor = 'default';
  var geometry = new THREE.PlaneGeometry( 100, 100, 32 );
  var material = new THREE.MeshLambertMaterial( {color: 0x1873e7, side: THREE.DoubleSide} );
  var plane = new THREE.Mesh( geometry, material );
  plane.position.set(0, -2, 0);
  plane.rotation.set(Math.PI/2, 0, 0);
  var light = new THREE.HemisphereLight( 0xf9f9f9, 0x080820, 1 );
  scene.add( light );
  createOcean();
  light = new THREE.DirectionalLight(0xffffff, 1.0);
  light.position.set(0, 100, 0);
  scene.add(light);
  objectsInSceneStart = scene.children.length-1;
}

var bomb;
function loadBomb() {
  var loader = new OBJLoader();
	loader.load( '/assets/OBJ/SM_Prop_CannonBalls_01.obj', function ( object ) {
    object.name = "bomb";
    bomb = object;
  });
}

function updateCannons(me, cannon) {
  const {x, y, z, radius} = cannon;
  var n = bomb.clone();
  n.children[0].material = bomb.children[0].material.clone();
  n.children[0].material.color.set(0xFB9404);
  n.scale.set(radius, radius, radius);
  n.position.set(x, y, z);
  scene.add( n );
}

var smallShip;
function loadSmallShip() {
  var loader = new OBJLoader();
	loader.load( '/assets/OBJ/SM_Veh_Boat_Small_01_Hull_Pirate.obj', function ( object ) {
    object.name = "hull";
    smallShip = object;
  });
}

function createSmallShip(x, y, z, angleX, angleY, angleZ, colorStr, scale) {
  var color = colorStr.substring(0, 7);
  var curr = smallShip.clone();
  curr.scale.set(scale, scale, scale);
  curr.rotation.x = angleX;
  curr.rotation.y = angleY;
  curr.rotation.z = angleZ;
  curr.children[0].material = smallShip.children[0].material.clone();
  curr.children[0].material.color.set(color);
  curr.position.set(x, y+10, z);
  scene.add(curr);
}

var mediumShip = [];
function loadMediumShip() {
  var loader = new OBJLoader();
	loader.load( '/assets/OBJ/SM_Veh_Boat_Medium_01_Hull_Pirate.obj', function ( object ) {
    object.name = "hull";
    mediumShip.push(object);
  });
  loader.load( '/assets/OBJ/SM_Veh_Boat_Medium_01_Mast_Pirate.obj', function ( object ) {
    object.name = "mast";
    mediumShip.push(object);
  });
  loader.load( '/assets/OBJ/SM_Veh_Boat_Medium_01_Sails_Pirate.obj', function ( object ) {
    object.name = "sails";
    mediumShip.push(object);
  });
}

function createMediumShip(x, y, z, angleX, angleY, angleZ, colorStr, scale) {
  mediumShip.forEach(index => {
    var color = colorStr.substring(0, 7);
    var curr = index.clone();
    curr.scale.set(scale, scale, scale);
    curr.rotation.x = angleX;
    curr.rotation.y = angleY;
    curr.rotation.z = angleZ;
    if (curr.name === "hull") { 
      curr.children[0].material = index.children[0].material.clone();
      curr.children[0].material.color.set(color);
      curr.position.set(x, y, z);
    } else if (curr.name === "mast") {
      curr.children[0].material = index.children[0].material.clone();
      curr.children[0].material.color.set(color);
      curr.position.set(x, y, z);
    } else if (curr.name === "sails") {
      curr.children[0].material = index.children[0].material.clone();
      curr.children[0].material.color.set(sailColor);
      curr.position.set(x, y, z);
    }
    scene.add(curr);
  });
}

var largeShip = [];
function loadLargeShip() {
  var loader = new OBJLoader();
	loader.load( '/assets/OBJ/SM_Veh_Veh_Boat_Large_01_Hull_Pirate.obj', function ( object ) {
    object.name = "hull";
    largeShip.push(object);
  });
  loader.load( '/assets/OBJ/SM_Veh_Boat_Large_Mast_01_Pirate.obj', function ( object ) {
    object.name = "mast1";
    largeShip.push(object);
  });
  loader.load( '/assets/OBJ/SM_Veh_Boat_Large_Mast_02_Pirate.obj', function ( object ) {
    object.name = "mast2";
    largeShip.push(object);
  });
  loader.load( '/assets/OBJ/SM_Veh_Boat_Large_Sails_01_Pirate.obj', function ( object ) {
    object.name = "sails1";
    largeShip.push(object);
  });
  loader.load( '/assets/OBJ/SM_Veh_Boat_Large_Sails_02_Pirate.obj', function ( object ) {
    object.name = "sails2";
    largeShip.push(object);
  });
  loader.load( '/assets/OBJ/SM_Veh_Boat_Large_Sails_03_Pirate.obj', function ( object ) {
    object.name = "sails3";
    largeShip.push(object);
  });/*
  loader.load( '/assets/OBJ/SM_Veh_Veh_Boat_Large_01_Rigging.obj', function ( object ) {
    object.name = "rigging";
    object.children[0].material.color.set(sailColor);
    largeShip.push(object);
  });*/
}

function createLargeShip(x, y, z, angleX, angleY, angleZ, colorStr, scale) {
  largeShip.forEach(index => {
    var color = colorStr.substring(0, 7);
    var curr = index.clone();
    curr.scale.set(scale, scale, scale);
    curr.rotation.x = angleX;
    curr.rotation.y = angleY;
    curr.rotation.z = angleZ;
    if (curr.name === "hull") { 
      curr.children[0].material = index.children[0].material.clone();
      curr.children[0].material.color.set(color);
      curr.position.set(x, y, z);
    } else if (curr.name === "mast1") {
      curr.children[0].material = index.children[0].material.clone();
      curr.children[0].material.color.set(color);
      curr.position.set(x, y+3, z);
    } else if (curr.name === "mast2") {
      curr.children[0].material = index.children[0].material.clone();
      curr.children[0].material.color.set(color);
      curr.position.set(x, y+3, z);
      curr.translateZ(11);
    } else if (curr.name === "sails1") {
      curr.children[0].material = index.children[0].material.clone();
      curr.children[0].material.color.set(sailColor);
      curr.position.set(x, y+3, z);
    } else if (curr.name === "sails2") {
      curr.children[0].material = index.children[0].material.clone();
      curr.children[0].material.color.set(sailColor);
      curr.position.set(x, y+4, z);
      curr.translateZ(11);
    } else if (curr.name === "sails3") {
      curr.children[0].material = index.children[0].material.clone();
      curr.children[0].material.color.set(sailColor);
      curr.position.set(x, y+8, z);
      curr.translateZ(4);
    } else if (curr.name === "rigging") {
      curr.children[0].material = index.children[0].material.clone();
      curr.children[0].material.color.set(color);
      curr.position.set(x, y+3, z);
    }
    scene.add(curr);
  });
}

var warship = [];
function loadWarship() {
  var loader = new OBJLoader();
	loader.load( '/assets/OBJ/SM_Veh_Boat_Warship_01_Hull_Pirate.obj', function ( object ) {
    object.name = "hull";
    warship.push(object);
  });
  loader.load("/assets/OBJ/SM_Veh_Boat_Warship_01_Mast_01_Pirate.obj", function (object) {
    object.name = "mast1";
    warship.push(object);
  });
  loader.load("/assets/OBJ/SM_Veh_Boat_Warship_01_Mast_02_Pirate.obj", function (object) {
    object.name = "mast2";
    warship.push(object);
  });
  loader.load("/assets/OBJ/SM_Veh_Boat_Warship_01_Mast_03_Pirate.obj", function (object) {
    object.name = "mast3";
    warship.push(object);
  });
  loader.load("/assets/OBJ/SM_Veh_Boat_Warship_01_Sails_01_Pirate.obj", function (object) {
    object.name = "sails1";
    warship.push(object);
  });
  loader.load("/assets/OBJ/SM_Veh_Boat_Warship_01_Sails_02_Pirate.obj", function (object) {
    object.name = "sails2";
    warship.push(object);
  });
  loader.load("/assets/OBJ/SM_Veh_Boat_Warship_01_Sails_03_Pirate.obj", function (object) {
    object.name = "sails3";
    warship.push(object);
  });
}

function createWarship(x, y, z, angleX, angleY, angleZ, colorStr, scale) {
  warship.forEach(index => {
    var color = colorStr.substring(0, 7);
    var curr = index.clone();
    curr.scale.set(scale, scale, scale);
    curr.rotation.x = angleX;
    curr.rotation.y = angleY;
    curr.rotation.z = angleZ;
    if (curr.name === "hull") { 
      curr.children[0].material = index.children[0].material.clone();
      curr.children[0].material.color.set(color);
      curr.position.set(x, y, z)
    } else if (curr.name === "mast1") {
      curr.children[0].material = index.children[0].material.clone();
      curr.children[0].material.color.set(color);
      curr.position.set(x, y+8*scale, z);
      curr.translateZ(10*scale);
    } else if (curr.name === "mast2") {
      curr.children[0].material = index.children[0].material.clone();
      curr.children[0].material.color.set(color);
      curr.position.set(x, y+6*scale, z);
    } else if (curr.name === "mast3") {
      curr.children[0].material = index.children[0].material.clone();
      curr.children[0].material.color.set(color);
      curr.position.set(x, y+11*scale, z);
      curr.translateZ(-2-10*scale);
    } else if (curr.name === "sails1") {
      curr.children[0].material = index.children[0].material.clone();
      curr.children[0].material.color.set(sailColor);
      curr.position.set(x, y+8*scale, z);
      curr.translateZ(10*scale);
    } else if (curr.name === "sails2") {
      curr.children[0].material = index.children[0].material.clone();
      curr.children[0].material.color.set(sailColor);
      curr.position.set(x, y+6*scale, z);
    } else if (curr.name === "sails3") {
      curr.children[0].material = index.children[0].material.clone();
      curr.children[0].material.color.set(sailColor);
      curr.position.set(x, y+11*scale, z);
      curr.translateZ(-2-10*scale);
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
  var gsize = 2000;
  var res = 256;
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

function createLabel(x, y, z, name, camX, camHeight, camZ, scale) {
  const labelGeometry = new THREE.PlaneGeometry(scale*5, scale*2, 1);
  const canvas = makeLabelCanvas(300, 300, name);
  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  const labelMaterial = new THREE.MeshBasicMaterial({
    map: texture,
    side: THREE.DoubleSide,
    transparent: true,
  });
  const label = new THREE.Mesh(labelGeometry, labelMaterial);
  scene.add(label);
  label.position.set(x, y+41*scale, z);
  label.lookAt(camX, camHeight, camZ);
  label.scale.x = canvas.width * 0.01;
  label.scale.y = canvas.height * 0.01;
}

function makeLabelCanvas(baseWidth, size, name) {
  const borderSize = 2;
  const ctx = document.createElement('canvas').getContext('2d');
  const font =  `${size}px bold sans-serif`;
  ctx.font = font;
  // measure how long the name will be
  const textWidth = ctx.measureText(name).width;

  const doubleBorderSize = borderSize * 2;
  const width = baseWidth + doubleBorderSize;
  const height = size + doubleBorderSize;
  ctx.canvas.width = width;
  ctx.canvas.height = height;

  // need to set font again after resizing canvas
  ctx.font = font;
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'center';

  ctx.fillStyle = 'blue';
  ctx.fillRect(0, 0, width, height);

  // scale to fit but don't stretch
  const scaleFactor = Math.min(1, baseWidth / textWidth);
  ctx.translate(width / 2, height / 2);
  ctx.scale(scaleFactor, 1);
  ctx.fillStyle = 'white';
  ctx.fillText(name, 0, 0);

  return ctx.canvas;
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