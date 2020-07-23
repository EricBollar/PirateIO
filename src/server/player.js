const ObjectClass = require('./object');
const Cannonball = require('./cannonball');
const Constants = require('../shared/constants');

class Player extends ObjectClass {
  constructor(id, username, x, z) {
    super(id);
    this.x = x;
    this.y = -3;
    this.z = z;
    this.username = username;
    this.angleY = 0;
    this.angleX = 0;
    this.angleZ = 0;
    this.shouldTurnRight = false;
    this.shouldTurnLeft = false;
    this.currTurnRate = 0;
    this.maxTurnRate = 1 * Math.PI / 180;
    this.turnAccel = 0.02 * Math.PI / 180;
    this.camX = 0;
    this.camZ = 0;
    this.camHeight = 120;
    this.camAngle = 0;
    this.camAngleStep = 2 * Math.PI/180;
    this.camRadius = 180;
    this.speed = 0.5;
    this.cannonSpeed = 1;
    this.created = 1;
    this.reloadTime = 1;
    this.fireCooldown = 0;
    this.fire = false;
    this.health = 100;
    this.isCamTurnRight = false;
    this.isCamTurnLeft = false;
    this.time = 0;
  }

  update(dt) {
    this.time += dt;
    super.update(dt);
    this.created--;

    this.calcShipAngle();
    this.moveForward();
    this.calcBob(this.time);

    this.fireCooldown -= dt;

    if (this.fire) {
      this.fire = false;
      var cannonballs = [];
      cannonballs.push(new Cannonball(this.id, this.x, this.z, this.cannonSpeed, this.angleY, Math.PI/2));
      cannonballs.push(new Cannonball(this.id, this.x, this.z, this.cannonSpeed, this.angleY, -Math.PI/2));
      cannonballs.push(new Cannonball(this.id, this.x + Math.sin(this.angleY) * -5, this.z + Math.cos(this.angleY) * -5, this.cannonSpeed, this.angleY, Math.PI/2));
      cannonballs.push(new Cannonball(this.id, this.x + Math.sin(this.angleY) * -5, this.z + Math.cos(this.angleY) * -5, this.cannonSpeed, this.angleY, -Math.PI/2));
      cannonballs.push(new Cannonball(this.id, this.x + Math.sin(this.angleY) * 5, this.z + Math.cos(this.angleY) * 5, this.cannonSpeed, this.angleY, Math.PI/2));
      cannonballs.push(new Cannonball(this.id, this.x + Math.sin(this.angleY) * 5, this.z + Math.cos(this.angleY) * 5, this.cannonSpeed, this.angleY, -Math.PI/2));
      return cannonballs;
    }

    if (this.isCamTurnRight && !this.isCamTurnLeft) {
      this.updateCamera(this.camAngleStep);
    } else if (this.isCamTurnLeft && !this.isCamTurnRight) {
      this.updateCamera(-this.camAngleStep);
    } else {
      this.updateCamera(0);
    }
    return null;
  }

  calcBob(t) {
    this.y = Math.sin(t) - 3;
    this.angleX = -Math.sin(t+2) * 2 * Math.PI/180;
  }

  fireCannon() {
    if (this.fireCooldown <= 0) {
      this.fireCooldown = this.reloadTime;
      this.fire = true;
    }
  }

  camTurnRight(bool) {
    this.isCamTurnRight = bool;
  }

  camTurnLeft(bool) {
    this.isCamTurnLeft = bool;
  }

  turnRight(bool) {
    this.shouldTurnRight = bool;
  }

  turnLeft(bool) {
    this.shouldTurnLeft = bool;
  }

  lowerHealth(amt) {
    this.health -= amt;
  }

  updateCamera(x) {
    this.camAngle += x;
    this.camX = Math.sin(this.camAngle) * this.camRadius + this.x;
    this.camZ = Math.cos(this.camAngle) * -this.camRadius + this.z;
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
        this.currTurnRate -= this.turnAccel;
        this.angleY += this.currTurnRate;
      } else {
        this.currTurnRate += this.turnAccel;
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
      health: this.health,
      y: this.y,
      angleX: this.angleX,
    };
  }
}

module.exports = Player;
