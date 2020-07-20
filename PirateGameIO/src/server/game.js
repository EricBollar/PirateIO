const Constants = require('../shared/constants');
const Player = require('./player');
const applyCollisions = require('./collisions');

class Game {
  constructor() {
    this.sockets = {};
    this.players = {};
    this.bullets = [];
    this.lastUpdateTime = Date.now();
    this.shouldSendUpdate = false;
    setInterval(this.update.bind(this), 1000 / 60);
  }

  addPlayer(socket, username) {
    this.sockets[socket.id] = socket;
    this.players[socket.id] = new Player(socket.id, username, 0, 0);
  }

  removePlayer(socket) {
    delete this.sockets[socket.id];
    delete this.players[socket.id];
  }

  shipTurnRight(socket, bool) {
    if (this.players[socket.id]) {
      this.players[socket.id].turnRight(bool);
    }
  }

  shipTurnLeft(socket, bool) {
    if (this.players[socket.id]) {
      this.players[socket.id].turnLeft(bool);
    }
  }

  updateCamera(socket, pos) {
    if (this.players[socket.id]) {
      this.players[socket.id].updateCamera(pos);
    }
  }

  update() {
    // Calculate time elapsed
    const now = Date.now();
    const dt = (now - this.lastUpdateTime) / 1000;
    this.lastUpdateTime = now;

    // Update each player
    Object.keys(this.sockets).forEach(playerID => {
      const player = this.players[playerID];
      player.update(dt);
    });

    // // Apply collisions, give players score for hitting bullets
    // const destroyedBullets = applyCollisions(Object.values(this.players), this.bullets);
    // destroyedBullets.forEach(b => {
    //   if (this.players[b.parentID]) {
    //     this.players[b.parentID].onDealtDamage();
    //   }
    // });
    // this.bullets = this.bullets.filter(bullet => !destroyedBullets.includes(bullet));

    // // Check if any players are dead
    // Object.keys(this.sockets).forEach(playerID => {
    //   const socket = this.sockets[playerID];
    //   const player = this.players[playerID];
    //   if (player.hp <= 0) {
    //     socket.emit(Constants.MSG_TYPES.GAME_OVER);
    //     this.removePlayer(socket);
    //   }
    // });

    // Send a game update to each player every other time
    if (this.shouldSendUpdate) {
      const leaderboard = this.getLeaderboard();
      Object.keys(this.sockets).forEach(playerID => {
        const socket = this.sockets[playerID];
        const player = this.players[playerID];
        socket.emit(Constants.MSG_TYPES.GAME_UPDATE, this.createUpdate(player, leaderboard));
      });
      this.shouldSendUpdate = false;
    } else {
      this.shouldSendUpdate = true;
    }
  }

  getLeaderboard() {
    return Object.values(this.players)
      .sort((p1, p2) => p2.score - p1.score)
      .slice(0, 5)
      .map(p => ({ username: p.username, score: Math.round(p.score) }));
  }

  createUpdate(player, leaderboard) {
    // const nearbyPlayers = Object.values(this.players).filter(
    //   p => p !== player && p.distanceTo(player) <= Constants.MAP_SIZE / 2,
    // );
    // const nearbyBullets = this.bullets.filter(
    //   b => b.distanceTo(player) <= Constants.MAP_SIZE / 2,
    // );

    return {
      t: Date.now(),
      me: player.serializeForUpdate(),
      others: Object.values(this.players).map(p => p.serializeForUpdate()),
      leaderboard,
    };
  }
}

module.exports = Game;