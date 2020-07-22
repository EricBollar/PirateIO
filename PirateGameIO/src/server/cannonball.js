const shortid = require('shortid');
const ObjectClass = require('./object');
const Constants = require('../shared/constants');

class Cannonball extends ObjectClass {
  constructor(parentID, startX, startZ, speed, dir, angle) {
    super(shortid());
    this.parentID = parentID;
    this.dir = dir;
    this.startX = startX;
    this.x = startX;
    this.y = 1;
    this.startZ = startZ;
    this.z = startZ;
    this.parabolaX = 0;
    this.speed = speed;
    this.angle = angle;
    this.radius = 0.2;
  }

  update(dt) {
    super.update(dt);
    this.calcPosition();
  }

  calcPosition() {
    this.x += Math.sin(this.dir + this.angle) * this.speed * 2;
    this.z += Math.cos(this.dir + this.angle) * this.speed * 2;
    this.x += Math.sin(this.dir) * this.speed;
    this.z += Math.cos(this.dir) * this.speed;
    this.y = -0.25 * Math.pow(this.parabolaX - 2.75, 2) + 2;
    this.parabolaX += this.speed;
  }

  distanceTo(x, z) {
    return Math.sqrt(Math.pow(this.x - x, 2) + Math.pow(this.z - z, 2));
  }

  serializeForUpdate() {
    return {
      ...(super.serializeForUpdate()),
      x: this.x,
      y: this.y,
      z: this.z,
      radius: this.radius,
    };
  }
}

module.exports = Cannonball;
