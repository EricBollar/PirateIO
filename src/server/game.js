const Constants = require('../shared/constants');
const Player = require('./player');
const applyCollisions = require('./collisions');

class Game {
  constructor() {
    this.sockets = {};
    this.players = {};
    this.cannonballs = [];
    this.chests = [];
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

  camTurnRight(socket, bool) {
    if (this.players[socket.id]) {
      this.players[socket.id].camTurnRight(bool);
    }
  }

  camTurnLeft(socket, bool) {
    if (this.players[socket.id]) {
      this.players[socket.id].camTurnLeft(bool);
    }
  }

  shipFireCannon(socket) {
    if (this.players[socket.id]) {
      this.players[socket.id].fireCannon();
    }
  }

  update() {
    // Calculate time elapsed
    const now = Date.now();
    const dt = (now - this.lastUpdateTime) / 1000;
    this.lastUpdateTime = now;

    // Update each player
    const cannonballsToRemove = [];
    const chestsToRemove = [];
    Object.keys(this.sockets).forEach(playerID => {
      const socket = this.sockets[playerID];
      const player = this.players[playerID];
      const newCannonballs= player.update(dt);
      if (newCannonballs) {
        newCannonballs.forEach(newCannonball => {this.cannonballs.push(newCannonball)});
      }
      this.cannonballs.forEach(cannonball => {
        if (cannonball.distanceTo(player.x, player.z) <= 15*player.scale && cannonball.parentID !== player.id) {
          player.lowerHealth(player.gold / 3 + 1);
          cannonballsToRemove.push(cannonball);
        }
      })
      this.chests.forEach(chest => {
        if (chest.distanceTo(player.x, player.z) <= 15*player.scale) {
          player.gold += 20;
          chestsToRemove.push(chest);
        }
      })
      if (player.health <= 0) {
        socket.emit(Constants.MSG_TYPES.GAME_OVER);
        var newChests = player.createChest();
        newChests.forEach(c => (this.chests.push(c)));
        this.removePlayer(socket);
      }
    });

    this.chests.forEach(chest => {
      chest.update(dt);
    });
    this.chests = this.chests.filter(chest => !chestsToRemove.includes(chest));

    this.cannonballs.forEach(cannonball => {
      if (cannonball.y < -5) {
        cannonballsToRemove.push(cannonball);
      } else {
        cannonball.update(dt);
      }
    });
    this.cannonballs = this.cannonballs.filter(cannonball => !cannonballsToRemove.includes(cannonball));

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

  getError() {

  }

  getLeaderboard() {
    return Object.values(this.players)
      .sort((p1, p2) => p2.score - p1.score)
      .slice(0, 5)
      .map(p => ({ username: p.username, gold: Math.round(p.gold) }));
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
      cannonballs: this.cannonballs.map(b => b.serializeForUpdate()),
      chests: this.chests.map(u => u.serializeForUpdate()),
      leaderboard,
    };
  }
}

module.exports = Game;
