import { shipTurnLeft, shipTurnRight, updateCamera } from './networking';

function keyPress() {
  if (event.keyCode === 65) {
    shipTurnLeft(true);
  } else if (event.keyCode === 68) {     
    shipTurnRight(true);
  }
}

function keyUp() {
  if (event.keyCode === 65) {
    shipTurnLeft(false);
  } else if (event.keyCode === 68) {     
    shipTurnRight(false);
  }
}

function mouseMove() {
  updateCamera(event.x);
}

export function startCapturingInput() {
  window.addEventListener('mousemove', mouseMove);
  window.addEventListener('keydown', keyPress);
  window.addEventListener('keyup', keyUp);
}

export function stopCapturingInput() {
  window.removeEventListener('mousemove', mouseMove);
  window.removeEventListener('keydown', keyPress);
  window.removeEventListener('keyup', keyUp);
}
