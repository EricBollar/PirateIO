const shortid = require('shortid');
const ObjectClass = require('./object');
const Constants = require('../shared/constants');

class Chest extends ObjectClass {
  constructor(parentID, x, z) {
    const myId = shortid()
    super(myId);
    this.id = myId;
    this.parentID = parentID;
    this.gold = 100;
    this.x = x;
    this.y = Math.floor(Math.random()*10-25);
    this.z = z;
    this.angle = Math.random() + (360 * Math.PI/180);
  }

  update(dt) {
    super.update(dt);
    this.calcPosition();
  }

  calcPosition() {
    if (this.y < 10) {
      this.y += 0.2;
    }
    this.angle += 1 * Math.PI / 180;
  }

  distanceTo(x, z) {
    return Math.sqrt(Math.pow(this.x - x, 2) + Math.pow(this.z - z, 2) + Math.pow(this.y, 2));
  }

  serializeForUpdate() {
    return {
      ...(super.serializeForUpdate()),
      x: this.x,
      y: this.y,
      z: this.z,
      id: this.id,
      gold: this.gold,
      angle: this.angle,
    };
  }
}

module.exports = Chest;
