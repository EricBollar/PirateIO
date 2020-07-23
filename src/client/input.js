import { shipTurnLeft, shipTurnRight, camTurnRight, camTurnLeft, shipFireCannon } from './networking';

function keyPress() {
  if (event.keyCode === 65) {
    shipTurnLeft(true);
  } else if (event.keyCode === 68) {     
    shipTurnRight(true);
  } else if (event.keyCode === 32) {
    shipFireCannon();
  } else if (event.keyCode === 76) {
    camTurnRight(true);
  } else if (event.keyCode === 74) {
    camTurnLeft(true);
  }
}

function keyUp() {
  if (event.keyCode === 65) {
    shipTurnLeft(false);
  } else if (event.keyCode === 68) {     
    shipTurnRight(false);
  } else if (event.keyCode === 76) {     
    camTurnRight(false);
  } else if (event.keyCode === 74) {     
    camTurnLeft(false);
  }
}

function mouseMove() {
  //updateCamera(event.x);
}

var prevScroll = 0;
function onScroll() {
  if (document.body.scrollTop > prevScroll) {
    //camZoomIn();
    console.log("here!");
    prevScroll = document.body.scrollTop;
  } else if (document.body.scrollTop < prevScroll) {

  }
}

export function startCapturingInput() {
  window.addEventListener('mousemove', mouseMove);
  window.addEventListener('onscroll', onScroll);
  window.addEventListener('keydown', keyPress);
  window.addEventListener('keyup', keyUp);
}

export function stopCapturingInput() {
  window.removeEventListener('mousemove', mouseMove);
  window.removeEventListener('onscroll', onScroll);
  window.removeEventListener('keydown', keyPress);
  window.removeEventListener('keyup', keyUp);
}
