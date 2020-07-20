import { shipTurnLeft, shipTurnRight } from './networking';

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

export function startCapturingInput() {
  window.addEventListener('keydown', keyPress);
  window.addEventListener('keyup', keyUp);
}

export function stopCapturingInput() {
  window.removeEventListener('keydown', keyPress);
  window.removeEventListener('keyup', keyUp);
}
