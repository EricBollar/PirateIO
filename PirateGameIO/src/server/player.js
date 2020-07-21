const ObjectClass = require('./object');
const Bullet = require('./bullet');
const Constants = require('../shared/constants');

class Player extends ObjectClass {
  constructor(id, username, x, z) {
    super(id);
    this.x = x;
    this.z = z;
    this.username = username;
    this.angleY = 0;
    this.angleZ = 0;
    this.shouldTurnRight = false;
    this.shouldTurnLeft = false;
    this.currTurnRate = 0;
    this.maxTurnRate = 1 * Math.PI / 180;
    this.turnAccel = 0.02 * Math.PI / 180;
    this.camX = 0;
    this.camZ = 0;
    this.camHeight = 30;
    this.camAngle = 0;
    this.camAngleStep = 0.01;
    this.camRadius = 30;
    this.prevCamX = 0;
    this.speed = 0.1;
    this.created = 1;
  }

  update(dt) {
    super.update(dt);
    this.created--;

    this.calcShipAngle();
    this.moveForward();
    this.updateCamera(this.prevCamX);

    return null;
  }

  turnRight(bool) {
    this.shouldTurnRight = bool;
  }

  turnLeft(bool) {
    this.shouldTurnLeft = bool;
  }

  updateCamera(x) {
    var amount = x - this.prevCamX;
    this.camAngle += this.camAngleStep * amount;
    this.camX = Math.sin(this.camAngle) * this.camRadius + this.x;
    this.camZ = Math.cos(this.camAngle) * -this.camRadius + this.z;
    this.prevCamX = x;
  }

  moveForward() {
    this.x += Math.sin(this.angleY) * this.speed;
    this.z += Math.cos(this.angleY) * this.speed;
  }

  calcShipAngle() {
    if (this.shouldTurnLeft && !this.shouldTurnRight) {
      if (this.currTurnRate < this.maxTurnRate) {
        this.currTurnRate += this.turnAccel;
      }
      this.angleY += this.currTurnRate;
    } else if (this.shouldTurnRight && !this.shouldTurnLeft) {
      if (this.currTurnRate > -this.maxTurnRate) {
        this.currTurnRate -= this.turnAccel;
      }
      this.angleY += this.currTurnRate;
    } else {
      if (this.currTurnRate > 0) {
        this.currTurnRate -= this.turnAccel * 0.5;
        this.angleY += this.currTurnRate;
      } else {
        this.currTurnRate += this.turnAccel * 0.5;
        this.angleY += this.currTurnRate;
      }
    }
    if (this.angleY > 2 * Math.PI) {
      this.angleY -= 2 * Math.PI;
    }
    this.angleZ = this.currTurnRate * 10;
  }
    
  serializeForUpdate() {
    return {
      ...(super.serializeForUpdate()),
      x: this.x,
      z: this.z,
      angleY: this.angleY,
      camX: this.camX,
      camZ: this.camZ,
      camHeight: this.camHeight,
      angleZ: this.angleZ,
      shouldTurnRight: this.shouldTurnRight,
      shouldTurnLeft: this.shouldTurnLeft,
      currTurnRate: this.currTurnRate,
      maxTurnRate: this.maxTurnRate,
      turnAccel: this.turnAccel,
      camAngle: this.camAngle,
      camAngleStep: this.camAngleStep,
      camRadius: this.camRadius,
      prevCamX: this.prevCamX,
      speed: this.speed,
      created: this.created,
    };
  }
}

module.exports = Player;
