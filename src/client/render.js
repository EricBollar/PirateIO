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

var newShip;
var shipModel;
var shipMastOne;
var shipMastTwo;
var shipMastThree;
var shipSailsOne;
var shipSailsTwo;
var shipSailsThree;
var ocean;

var oceanCount = 5;
function render() {
  const { me, others, cannonballs } = getCurrentState();
  if (!me) {
    return;
  }

  if (newShip) {
    loadShip();
    newShip = false;
    console.log(others);
    console.log(cannonballs);
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
  while (scene.children.length > 2) {
    scene.remove(scene.children[scene.children.length - 1]);
  }
}

function updateCannons(me, cannon) {
  const {x, y, z, radius} = cannon;
  console.log(x + " " + y + " " + z);
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

function loadShip() {
  var loader = new OBJLoader();
	loader.load( '/assets/OBJ/SM_Veh_Boat_Warship_01_Hull_Pirate.obj', function ( object ) {
    //object.scale.set(0.3, 0.3, 0.3);
    shipModel = object;
  });
  loader.load("/assets/OBJ/SM_Veh_Boat_Warship_01_Mast_01_Pirate.obj", function (object) {
    //object.scale.set(0.3, 0.3, 0.3);
    shipMastOne = object;
  });
  loader.load("/assets/OBJ/SM_Veh_Boat_Warship_01_Mast_02_Pirate.obj", function (object) {
    //object.scale.set(0.3, 0.3, 0.3);
    shipMastTwo = object;
  });
  loader.load("/assets/OBJ/SM_Veh_Boat_Warship_01_Mast_03_Pirate.obj", function (object) {
    //object.scale.set(0.3, 0.3, 0.3);
    shipMastThree = object;
  });
  loader.load("/assets/OBJ/SM_Veh_Boat_Warship_01_Sails_01_Pirate.obj", function (object) {
    //object.scale.set(0.3, 0.3, 0.3);
    shipSailsOne = object;
  });
  loader.load("/assets/OBJ/SM_Veh_Boat_Warship_01_Sails_02_Pirate.obj", function (object) {
    //object.scale.set(0.3, 0.3, 0.3);
    shipSailsTwo = object;
  });
  loader.load("/assets/OBJ/SM_Veh_Boat_Warship_01_Sails_03_Pirate.obj", function (object) {
    //object.scale.set(0.3, 0.3, 0.3);
    shipSailsThree = object;
  });
  //shipModelTexture = THREE.TextureLoader.load('/assets/SourceFiles/Textures/Texture_01_A.png');
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
  //scene.add( plane );
  var light = new THREE.HemisphereLight( 0x1ecbe1, 0x080820, 1 );
  scene.add( light );
  createOcean();
  scene.background = new THREE.Color( 0x1ecbe1 );
  light = new THREE.DirectionalLight(0xffffff, 1.0);
  light.position.set(0, 100, 0);
  scene.add(light);
}

var prevY = 0;
function updatePlayer(me, player) {
  const {id, x, y, z, angleY, angleX, angleZ, health} = player;
  const {camX, camHeight, camZ} = me;
  var cube = new THREE.Mesh();
  cube = shipModel.clone();
  scene.add(cube);
  /*
  var point = undefined;
  if (oceanCount <= 0) {
    var raycaster = new THREE.Raycaster(new THREE.Vector3(x, 30, z), new THREE.Vector3(0, -1, 0));
    var intersects = raycaster.intersectObjects(scene.children, true);
    console.log(intersects);
  }
  cube.position.set(x, -1, z);
  if (!isUndefined(point)) {
    cube.position.y = point;
  }*/
  cube.position.set(x, y, z);
  cube.rotation.y = angleY;
  cube.rotation.z = angleZ;
  cube.rotation.x = angleX;

  var mastOne = new THREE.Mesh();
  mastOne = shipMastOne.clone();
  scene.add(mastOne);
  mastOne.position.set(x, cube.position.y+8, z);
  mastOne.rotation.y = angleY;
  mastOne.rotation.z = angleZ;
  mastOne.translateZ(8);
  var mastTwo = new THREE.Mesh();
  mastTwo = shipMastTwo.clone();
  scene.add(mastTwo);
  mastTwo.position.set(x, cube.position.y+6, z);
  mastTwo.rotation.y = angleY;
  mastTwo.rotation.z = angleZ;
  var mastThree = new THREE.Mesh();
  mastThree = shipMastThree.clone();
  scene.add(mastThree);
  mastThree.position.set(x, cube.position.y+11, z);
  mastThree.rotation.y = angleY;
  mastThree.rotation.z = angleZ;
  mastThree.translateZ(-12);

  var sailsOne = new THREE.Mesh();
  sailsOne = shipSailsOne.clone();
  scene.add(sailsOne);
  sailsOne.position.set(x, cube.position.y+8, z);
  sailsOne.rotation.y = angleY;
  sailsOne.rotation.z = angleZ;
  sailsOne.translateZ(8);
  var sailsTwo = new THREE.Mesh();
  sailsTwo = shipSailsTwo.clone();
  scene.add(sailsTwo);
  sailsTwo.position.set(x, cube.position.y+6, z);
  sailsTwo.rotation.y = angleY;
  sailsTwo.rotation.z = angleZ;
  var sailsThree = new THREE.Mesh();
  sailsThree = shipSailsThree.clone();
  scene.add(sailsThree);
  sailsThree.position.set(x, cube.position.y+11, z);
  sailsThree.rotation.y = angleY;
  sailsThree.rotation.z = angleZ;
  sailsThree.translateZ(-12);

  var geometry = new THREE.PlaneGeometry( 17, 3, 1 );
  var material = new THREE.MeshBasicMaterial( {color: 0x52130B, side: THREE.DoubleSide} );
  var plane = new THREE.Mesh( geometry, material );
  scene.add( plane );
  plane.position.set(x, cube.position.y+35, z);
  plane.lookAt(camX, camHeight, camZ);
  plane.translateZ(-0.1);
  var geometry = new THREE.PlaneGeometry( health/100.0 * 15, 2, 1 );
  var material = new THREE.MeshBasicMaterial( {color: 0x30dd22, side: THREE.DoubleSide} );
  var plane = new THREE.Mesh( geometry, material );
  scene.add( plane );
  plane.position.set(x, cube.position.y+35, z);
  plane.lookAt(camX, camHeight, camZ);
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