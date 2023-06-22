import { connect, play } from './networking';
import { startRendering, stopRendering } from './render';
import { startCapturingInput, stopCapturingInput, startCapturingEnter, stopCapturingEnter } from './input';
import { downloadAssets } from './assets';
import { initState } from './state';
import { setLeaderboardHidden, unableToJoin } from './leaderboard';

// I'm using a tiny subset of Bootstrap here for convenience - there's some wasted CSS,
// but not much. In general, you should be careful using Bootstrap because it makes it
// easy to unnecessarily bloat your site.
import './css/bootstrap-reboot.css';
import './css/main.css';

const playMenu = document.getElementById('play-menu');
const playButton = document.getElementById('play-button');
const usernameInput = document.getElementById('username-input');
const background = document.getElementById('background');

let playing = false;

Promise.all([
  connect(onGameOver),
  downloadAssets(),
]).then(() => {
  unableToJoin();
  playMenu.classList.remove('hidden');
  usernameInput.focus();
  startCapturingEnter();
  playButton.onclick = () => {
    // Play!
    startGame();
  };
}).catch(console.error);

export function startGame() {
  if (!playing) {
    let name = usernameInput.value;
    if (name.length > 9) {
      name = name.substring(0, 8);
    } else if (name.length <= 0) {
      name = "Unnamed";
    }

    play(name);
    playMenu.classList.add('hidden');
    background.classList.add('hidden');
    initState();
    startCapturingInput();
    
    startRendering();
    setLeaderboardHidden(false);
    stopCapturingEnter();
  }
}

function onGameOver() {
  playing = false;
  startCapturingEnter();
  stopCapturingInput();
  stopRendering();
  playMenu.classList.remove('hidden');
  setLeaderboardHidden(true);
}
