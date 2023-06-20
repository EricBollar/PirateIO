import { debounce } from 'throttle-debounce';
import { getCurrentState } from './state';
import { setLeaderboardHidden } from './leaderboard';
import * as CONSTANTS from '../shared/constants';
import { createScene } from './utils/createScene.js';
import { positionWarship } from './utils/positionWarship.js';
import { createWarshipPart } from './utils/createWarshipPart.js';
import * as THREE from './three/build/three.js';
import { loadWarship } from './utils/loadWarship';
import 'regenerator-runtime/runtime'
import Stats from './three/examples/jsm/libs/stats.module';
import { createOcean } from './utils/createOcean';
import { createLabel } from './utils/makeLabelCanvas';
import { positionLabel } from './utils/makeLabelCanvas';
import { rotateWarship } from './utils/rotateWarship';
import { scaleWarship } from './utils/scaleWarship';
import { removeNan } from './utils/removeNan';
import { clearMinimap, createMinimap, updateMinimap } from './utils/minimap';
import { createHealthBar, positionHealthBar } from './utils/createHealthBar';
import { loadCannonball } from './utils/loadCannonball';
import { createCannonball } from './utils/createCannonball';

// get the canvas graphics context
const canvas = document.getElementById('game-canvas');
canvas.style.cursor = 'none';

// setup the scene
const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer({canvas});
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
createScene(canvas, scene, renderer, camera);

// listen for window resizing and adjust accordingly
window.addEventListener('resize', debounce(40, setCanvasDimensions));
function setCanvasDimensions() {
  const scaleRatio = Math.max(1, 800 / window.innerWidth);
  canvas.width = scaleRatio * window.innerWidth;
  canvas.height = scaleRatio * window.innerHeight;
}

// load necessary files
let assetsLoaded = false;
let shipFiles;
let cannonballFiles;
(async () => {
  shipFiles = await loadWarship();
  cannonballFiles = await loadCannonball();

  assetsLoaded = true;
  console.log("Assets loaded!");
})();
console.log("Loading assets...");

// create ocean water
const water = createOcean(scene);
scene.add( water );

// create Stats
const stats = new Stats()
document.body.appendChild(stats.dom)

// create Minimap
const minimap = createMinimap();

let start = true;
let lastTime = (new Date()).getTime();
// render the current frame
function render() {
  // if files have not yet loaded, don't render
  if (!assetsLoaded) {
    return;
  } else if (start) { // first frame
    // showMinimap(true);
    start = false;
  }
  var currentTime = new Date().getTime();
  const dt = ( currentTime - lastTime ) / 1000 || 0.0;
  lastTime = currentTime;

  // update water
  water.material.uniforms[ 'time' ].value += dt;

  // get gamestate
  const { me, allShips, cannonballs, chests } = getCurrentState();
  // if couldn't join
  if (!me) {
    document.getElementById("unabletojoin").style.display = "";
    setLeaderboardHidden(true);
    return;
  }
  
  let cannonballsToRender = [];
  if (cannonballs.length > 0) {
    cannonballs.forEach(ball => {
      const ballNameClean = removeNan(ball.id);
      cannonballsToRender.push(ballNameClean+"cannonball");
      let exists = false;
      scene.children.forEach(obj => {
        if (obj.name === ballNameClean+"cannonball") {
          obj.position.set(ball.x, ball.y, ball.z);
          exists = true;
        }
      })
      if (!exists) {
        const newBall = createCannonball(ballNameClean, ball.radius, cannonballFiles);
        scene.add(newBall);
      }
    });
  }

  // render all ships in scene
  let shipIdsToRender = drawShips(allShips, me);
  // remove any ships as necessary
  removeShips(shipIdsToRender, cannonballsToRender);

  // position camera
  camera.position.set(me.camX, me.camY, me.camZ);
  camera.lookAt(me.x, me.y, me.z);

  // end frame render
  renderer.render(scene, camera);
  stats.update();
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

function drawShips(allShips, me) {
  if (!allShips) { // is undefined at start
    return;
  }
  clearMinimap(minimap);
  let shipIdsToRender = [];
  allShips.forEach(ship => {

    // removes possible "NaN" at end
    let shipIdClean = removeNan(ship.id);

    shipIdsToRender.push(shipIdClean);

    // get the objects in scene tied to this ship id
    let shipObjectsToDraw = [];
    let foundInScene = false;
    scene.children.forEach(sceneObj => {
      if (sceneObj.name.includes(shipIdClean)) {
        foundInScene = true;
        shipObjectsToDraw.push(sceneObj);
      }
    });

    if (!foundInScene) {
      // create each part and add to scene
      shipFiles.forEach(shipPart => {
        scene.add(createWarshipPart(shipPart, ship.color, ship.scale, shipIdClean));
      });

      // create label
      let usernameClean = removeNan(ship.username);
      const labelCanvas = createLabel(usernameClean, ship.scale, shipIdClean);
      scene.add(labelCanvas.label);

      // create HealthBar
      const healthbar = createHealthBar(shipIdClean);
      scene.add(healthbar.background);
      scene.add(healthbar.hp);
    } else {
      // position and rotate
      positionWarship(shipObjectsToDraw, ship.x, ship.y, ship.z, ship.scale);
      rotateWarship(shipObjectsToDraw, ship.angleX, ship.angleY, ship.angleZ, me.camX, me.camY, me.camZ);
      scaleWarship(shipObjectsToDraw, ship.scale, ship.health);
      let ship2D = {x: ship.x, z: ship.z, scale: ship.scale, color: removeNan(ship.color) };
      if (ship.id === me.id) {
        updateMinimap(minimap, ship2D, true);
      } else {
        updateMinimap(minimap, ship2D, false);
      }
    }
  });
  return shipIdsToRender;
}

// remove any ships that have died/dc'd
function removeShips(idsToRender, cannonballsToRender) {
  if (!idsToRender) {
    return;
  }
  scene.children.forEach(obj => {
    if (obj.type === "HemisphereLight" || obj.type === "DirectionalLight" || obj === water) {
      return;
    } else if (obj.name.includes("cannonball")) {
      let remove = true;
      cannonballsToRender.forEach(renderName => {
        if (renderName === obj.name) {
          remove = false;
        }
      })
      if (remove) {
        scene.remove(obj);
      }
      return;
    }
    let remove = true;
    idsToRender.forEach(id => {
      if (obj.name.includes(id)) {
        remove = false;
      }
    })
    if (remove) {
      scene.remove(obj);
    }
  });
}
