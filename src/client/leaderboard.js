import escape from 'lodash/escape';

const leaderboard = document.getElementById('leaderboard');
const rows = document.querySelectorAll('#leaderboard table tr');

export function updateLeaderboard(data) {
  // This is a bit of a hacky way to do this and can get dangerous if you don't escape usernames
  // properly. You would probably use something like React instead if this were a bigger project.
  data.sort(function(a, b) {return b.gold - a.gold});
  var max = 5;
  if (data.length < 5) {
    max = data.length;
  }
  for (let i = 0; i < max; i++) {
    rows[i].innerHTML = `<td>${i+1}.</td><td>${escape(data[i].username.slice(0, 15)) || 'Unnamed'}</td><td>${data[i].gold}g</td>`;
  }
  if (data.length < 5) {
    for (let i = max; i < 5; i++) {
      rows[i].innerHTML = `<td>${i+1}.</td><td>-</td><td>-</td>`;
    }
  }
}

export function setLeaderboardHidden(hidden) {
  if (hidden) {
    leaderboard.classList.add('hidden');
  } else {
    leaderboard.classList.remove('hidden');
  }
}
