const ObjectClass = require('./object');
const Bullet = require('./bullet');
const Constants = require('../shared/constants');

class Player extends ObjectClass {
  constructor(id, username, x, y) {
    super(id, x, y);
    this.username = username;
    this.angle = 0;
    this.shouldTurnRight = false;
    this.shouldTurnLeft = false;
    this.currTurnRate = 0;
    this.maxTurnRate = 1 * Math.PI / 180;
    this.turnAccel = 0.01 * Math.PI / 180;
  }

  update(dt) {
    super.update(dt);

    this.calcShipAngle();

    return null;
  }

  turnRight(bool) {
    this.shouldTurnRight = bool;
  }

  turnLeft(bool) {
    this.shouldTurnLeft = bool;
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
      if (Math.abs(this.currTurnRate) > 0.1) {
        if (this.currTurnRate > 0.1) {
          this.currTurnRate -= this.turnAccel;
          this.angle += this.currTurnRate;
        } else {
          this.currTurnRate += this.turnAccel;
          this.angle += this.currTurnRate;
        }
      } else {
        this.currTurnRate = 0;
      }
    }
  }
    
  serializeForUpdate() {
    return {
      ...(super.serializeForUpdate()),
      angle: this.angle,
      shouldTurnRight: this.shouldTurnRight,
      shouldTurnLeft: this.shouldTurnLeft,
      currTurnRate: this.currTurnRate,
      maxTurnRate: this.maxTurnRate,
      turnAccel: this.turnAccel,
    };
  }
}

module.exports = Player;
