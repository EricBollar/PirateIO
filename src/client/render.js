import { debounce } from 'throttle-debounce';
import { getCurrentState } from './state';
import { setLeaderboardHidden } from './leaderboard';
import * as CONSTANTS from '../shared/constants';
import { createScene } from './utils/createScene.js';
import * as THREE from './three/build/three.js';
import 'regenerator-runtime/runtime'
import Stats from './three/examples/jsm/libs/stats.module';
import { removeNan } from './utils/removeNan';
import { loadFiles } from './utils/Loader';
import { Ocean } from './utils/Ocean';
import { Ship } from './utils/Ship';
import { Label } from './utils/Label';
import { Healthbar } from './utils/Healthbar';
import { Minimap } from './utils/minimap';
import { Cannonball } from './utils/Cannonball';

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
let rockFiles;
(async () => {
  const files = await loadFiles();
  shipFiles = files.shipFiles;
  cannonballFiles = files.cannonballFiles;
  rockFiles = files.rockFiles;

  assetsLoaded = true;
  return {shipFiles: shipFiles};
})();

// create ocean water
const ocean = new Ocean(2010);
scene.add( ocean.getObj() );

// create Stats
const stats = new Stats()
document.body.appendChild(stats.dom)

// create Minimap
const minimap = new Minimap();

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

  // calculate dt
  var currentTime = new Date().getTime();
  const dt = ( currentTime - lastTime ) / 1000 || 0.0;
  lastTime = currentTime;

  // update water
  ocean.update(dt);

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

      const ballIdClean = removeNan(ball.id);
      cannonballsToRender.push(ballIdClean);

      let exists = false;
      for (const [key, obj] of Object.entries(objsInScene)) {
        if (obj instanceof Cannonball && obj.getId().includes(ballIdClean)) {
          obj.position(ball.x, ball.y, ball.z);
          exists = true;
        }
      }
      if (!exists) {
        const newBall = new Cannonball(ballIdClean, ball.radius, cannonballFiles);
        newBall.position(ball.x, ball.y, ball.z);
        objsInScene["cannonball"+ballIdClean] = newBall;
        scene.add(newBall.getObj());
      }

    });
  }

  // render all ships in scene
  let shipIdsToRender = renderShips(allShips, me);
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

let objsInScene = {};
function renderShips(allShips, me) {
  // is undefined at start
  if (!allShips) { 
    return;
  }

  // clear minimap to redraw
  minimap.clear();

  let shipIdsToRender = [];
  allShips.forEach(ship => {
    const shipIdClean = removeNan(ship.id);
    shipIdsToRender.push(shipIdClean);

    // get the objects in scene tied to this ship id
    let shipOBJsToRender = [];
    let foundInScene = false;
    scene.children.forEach(sceneObj => {
      if (sceneObj.name.includes(shipIdClean)) {
        foundInScene = true;
        shipOBJsToRender.push(sceneObj);
      }
    });

    if (!foundInScene) {
      // create each part and add to scene
      const newShip = new Ship(shipFiles, ship.color, ship.scale, shipIdClean);
      objsInScene["ship"+shipIdClean] = newShip;
      newShip.getParts().forEach(part => { scene.add(part); });

      // create label
      const label = new Label(removeNan(ship.username));
      objsInScene["label"+shipIdClean] = label;
      scene.add(label.getObj());

      const healthbar = new Healthbar(shipIdClean);
      objsInScene["healthbar"+shipIdClean] = healthbar;
      scene.add(healthbar.getBackground());
      scene.add(healthbar.getHp());

      // create HealthBar
      // const healthbar = createHealthBar(shipIdClean);
      // scene.add(healthbar.background);
      // scene.add(healthbar.hp);
    } else {
      // position and rotate
      const {x, y, z, scale, angleX, angleY, angleZ, health, color} = ship;
      const {camX, camY, camZ} = me;

      // ship
      const shipObj = objsInScene["ship"+shipIdClean];
      shipObj.position(x, y, z, scale);
      shipObj.rotate(angleX, angleY, angleZ, camX, camY, camZ);
      shipObj.scale(scale);

      // label
      const shipLabel = objsInScene["label"+shipIdClean];
      shipLabel.position(x, y, z, scale);
      shipLabel.rotate(camX, camY, camZ);
      shipLabel.scale(scale);

      const shipHealthbar = objsInScene["healthbar"+shipIdClean];
      shipHealthbar.position(x, y, z, scale);
      shipHealthbar.rotate(camX, camY, camZ);
      shipHealthbar.scale(scale, health);

      minimap.update(x, z, scale, removeNan(color));

      // let shipMinimap = {x: ship.x, z: ship.z, scale: ship.scale, color: removeNan(ship.color) };
      // if (ship.id === me.id) {
      //   updateMinimap(minimap, shipMinimap, true);
      // } else {
      //   updateMinimap(minimap, shipMinimap, false);
      // }
    }
  });
  return shipIdsToRender;
}

// remove any ships that have died/dc'd
function removeShips(shipIdsToRender, cannonballsToRender) {
  if (!shipIdsToRender) {
    return;
  }
  for (const [key, obj] of Object.entries(objsInScene)) {
    let remove = true;
    if (obj instanceof Cannonball) {
      cannonballsToRender.forEach(id => {
        if (obj.getId().includes(id)) {
          remove = false;
        }
      })
    } else {
      shipIdsToRender.forEach(id => {
        if (key.includes(id)) {
          remove = false;
        }
      })
    }
    if (remove) {
      if (obj instanceof Healthbar) {
        scene.remove(obj.getHp());
        scene.remove(obj.getBackground());
      } else if (obj instanceof Ship) {
        console.log(obj.getParts());
        obj.getParts().forEach(part => {
          scene.remove(part);
        })
      } else {
        scene.remove(obj.getObj());
        delete objsInScene[key];
      }
    }
  }
  // scene.children.forEach(obj => {
  //   if (obj.type === "HemisphereLight" || obj.type === "DirectionalLight" || obj === water) {
  //     return;
  //   } else if (obj.name.includes("cannonball")) {
  //     let remove = true;
  //     cannonballsToRender.forEach(renderName => {
  //       if (renderName === obj.name) {
  //         remove = false;
  //       }
  //     })
  //     if (remove) {
  //       scene.remove(obj);
  //     }
  //     return;
  //   }
  //   let remove = true;
  //   idsToRender.forEach(id => {
  //     if (obj.name.includes(id)) {
  //       remove = false;
  //     }
  //   })
  //   if (remove) {
  //     scene.remove(obj);
  //   }
  // });
}
