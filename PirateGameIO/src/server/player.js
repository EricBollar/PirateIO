const ObjectClass = require('./object');
const Bullet = require('./bullet');
const Constants = require('../shared/constants');

class Player extends ObjectClass {
  constructor(id, username, x, z) {
    super(id);
    this.x = x;
    this.z = z;
    this.username = username;
    this.angle = 0;
    this.shouldTurnRight = false;
    this.shouldTurnLeft = false;
    this.currTurnRate = 0;
    this.maxTurnRate = 1 * Math.PI / 180;
    this.turnAccel = 0.02 * Math.PI / 180;
    this.camX = 0;
    this.camZ = 0;
    this.camHeight = 10;
    this.camAngle = 0;
    this.camAngleStep = 0.01;
    this.camRadius = 15;
    this.prevCamX = 0;
    this.speed = 0.1;
  }

  update(dt) {
    super.update(dt);

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
    this.x += Math.sin(this.angle) * this.speed;
    this.z += Math.cos(this.angle) * this.speed;
  }

  calcShipAngle() {
    if (this.shouldTurnLeft && !this.shouldTurnRight) {
      if (this.currTurnRate < this.maxTurnRate) {
        this.currTurnRate += this.turnAccel;
      }
      this.angle += this.currTurnRate;
    } else if (this.shouldTurnRight && !this.shouldTurnLeft) {
      if (this.currTurnRate > -this.maxTurnRate) {
        this.currTurnRate -= this.turnAccel;
      }
      this.angle += this.currTurnRate;
    } else {
      if (Math.abs(this.currTurnRate) > 0.1 * Math.PI / 180) {
        if (this.currTurnRate > 0) {
          this.currTurnRate -= this.turnAccel * 0.5;
          this.angle += this.currTurnRate;
        } else {
          this.currTurnRate += this.turnAccel * 0.5;
          this.angle += this.currTurnRate;
        }
      } else {
        this.currTurnRate = 0;
      }
    }
    if (this.angle > 2 * Math.PI) {
      this.angle -= 2 * Math.PI;
    }
  }
    
  serializeForUpdate() {
    return {
      ...(super.serializeForUpdate()),
      x: this.x,
      z: this.z,
      angle: this.angle,
      camX: this.camX,
      camZ: this.camZ,
      camHeight: this.camHeight,
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
    };
  }
}

module.exports = Player;
