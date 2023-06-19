import { debounce } from 'throttle-debounce';
import { getCurrentState } from './state';
import { setLeaderboardHidden } from './leaderboard';
import * as CONSTANTS from '../shared/constants';
import { createScene } from './utils/createScene.js';
import { positionWarship } from './utils/positionWarship.js';
import { createWarship } from './utils/createWarship.js'
import { createWarshipPart } from './utils/createWarshipPart.js';
import * as THREE from './three/build/three.js';
import { loadWarship } from './utils/loadWarship';
import 'regenerator-runtime/runtime'
import { createOcean } from './utils/createOcean';
import { updateOcean } from './utils/updateOcean';
import { Water } from './three/examples/jsm/objects/Water';
import Stats from './three/examples/jsm/libs/stats.module';
import { getRandomHexColor } from './utils/getRandomHexColor.js';

// get the canvas graphics context
const canvas = document.getElementById('game-canvas');
canvas.style.cursor = 'none';

// setup the scene
const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer({canvas});
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 500);
createScene(canvas, scene, renderer, camera);

// listen for window resizing and adjust accordingly
window.addEventListener('resize', debounce(40, setCanvasDimensions));
function setCanvasDimensions() {
  const scaleRatio = Math.max(1, 800 / window.innerWidth);
  canvas.width = scaleRatio * window.innerWidth;
  canvas.height = scaleRatio * window.innerHeight;
}

// load necessary files
let myShip = [];
const color = getRandomHexColor();
let assetsLoaded = false;
let shipFiles;
(async () => {
  shipFiles = await loadWarship();
  shipFiles.forEach(shipPart => {
    let sceneObject = createWarshipPart(shipPart, color, 1);
  
    // add to scene and assign it to myShip
    scene.add(sceneObject);
    myShip.push(scene.children[scene.children.length - 1]);
  });

  console.log("Assets loaded!");
  assetsLoaded = true;
})();
console.log("Loading assets...");

document.getElementById("unabletojoin").classList.add("hidden");
    // drawBeach();
// drawHill();
// objectsInSceneStart = scene.children.length

const waterGeometry = new THREE.PlaneGeometry( 10000, 10000 );

const water = new Water(
  waterGeometry,
  {
    textureWidth: 2048,
    textureHeight: 2048,
    waterNormals: new THREE.TextureLoader().load( '/waternormals.jpg', function ( texture ) {

      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

    } ),
    sunDirection: new THREE.Vector3(),
    sunColor: 0xffffff,
    waterColor: 0x001e0f,
    distortionScale: 6,
    fog: scene.fog !== undefined
  }
);

water.position.set(0, 3, 0);
water.rotation.x = - Math.PI / 2;

scene.add( water );

const stats = new Stats()
document.body.appendChild(stats.dom)

// const ocean = createOcean(renderer, camera, scene);
// scene.add(ocean.oceanMesh);

let step = 0;
let lastTime = (new Date()).getTime();
// render the current frame
function render() {
  // if files have not yet loaded, don't render
  if (!assetsLoaded) {
    return;
  }
  var currentTime = new Date().getTime();
  const dt = ( currentTime - lastTime ) / 1000 || 0.0;
  lastTime = currentTime;

  water.material.uniforms[ 'time' ].value += dt;


  // get gamestate
  const { me, others, cannonballs, chests } = getCurrentState();
  // if !me, couldn't join
  if (!me) {
    document.getElementById("unabletojoin").style.display = "";
    setLeaderboardHidden(true);
    return;
  }
  // setLeaderboardHidden(false);

  // console.log("coords below");
  // console.log(me.x, me.y, me.z);
  // console.log("campos");
  // console.log(me.camX, me.camY, me.camZ);

  positionWarship(myShip, me.x, me.y, me.z, 1);
  myShip.forEach(shipPart => {
    shipPart.rotation.set(me.angleX, me.angleY, me.angleZ);
  })

  camera.position.set(me.camX, me.camY, me.camZ);
  camera.lookAt(me.x, me.y, me.z);
  camera.translateY(10);

  // updatePlayer(me);
  // others.forEach(updatePlayer.bind(null, me));
  // cannonballs.forEach(updateCannons.bind(null, me));
  // chests.forEach(updateChests.bind(null, me));
  // updateCam(me);
  step++;
  renderer.render(scene, camera);
  stats.update();
}

// init();
function init() {
  // loadBeach();
  // loadWarship();
  // loadLargeShip();
  // loadMediumShip();
  // loadSmallShip();
  // loadBomb();
  // loadChest();
  // loadHill();
}

function renderMainMenu() {
  const t = Date.now() / 7500;
  const x = CONSTANTS.MAP_SIZE / 2 + 800 * Math.cos(t);
  const y = CONSTANTS.MAP_SIZE / 2 + 800 * Math.sin(t);
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
