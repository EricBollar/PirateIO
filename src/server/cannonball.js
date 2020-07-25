const shortid = require('shortid');
const ObjectClass = require('./object');
const Constants = require('../shared/constants');

class Cannonball extends ObjectClass {
  constructor(parentID, startX, startZ, speed, shipSpeed, dir, angle, adjust) {
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
    this.radius = 1;
    this.shipSpeed = shipSpeed;
    this.adjust = adjust;
  }

  update(dt) {
    super.update(dt);
    this.calcPosition();
  }

  calcPosition() {
    this.x += Math.sin(this.dir + this.angle) * this.speed * 2;
    this.z += Math.cos(this.dir + this.angle) * this.speed * 2;
    if (this.adjust) {2
      this.x += Math.sin(this.dir) * this.speed * this.shipSpeed;
      this.z += Math.cos(this.dir) * this.speed * this.shipSpeed;
    }
    this.y = -(1.0/80) * Math.pow(this.parabolaX - 25, 2) + 8;
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
