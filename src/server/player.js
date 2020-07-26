const ObjectClass = require('./object');
const Cannonball = require('./cannonball');
const Constants = require('../shared/constants');

class Player extends ObjectClass {
  constructor(id, username, x, z) {
    super(id);
    this.x = x;
    this.y = 0;
    this.z = z;
    this.username = username;
    this.angleY = 0;
    this.angleX = 0;
    this.angleZ = 0;
    this.shouldTurnRight = false;
    this.shouldTurnLeft = false;
    this.currTurnRate = 0;
    this.maxTurnRate = 1 * Math.PI / 180;
    this.turnAccel = 0.025 * Math.PI / 180;
    this.camX = 0;
    this.camZ = 0;
    this.camHeight = 100; //50 - 120
    this.camAngle = 0;
    this.camAngleStep = 2 * Math.PI/180;
    this.camRadius = 160; // 80 - 180
    this.speed = 0.3;
    this.cannonSpeed = 1;
    this.reloadTime = 1;
    this.fireCooldown = 0;
    this.fire = false;
    this.health = 100;
    this.isCamTurnRight = false;
    this.isCamTurnLeft = false;
    this.time = 0;
    this.color = this.getRandomColor();
    this.gold = 0;
    this.ship = 3;
    this.scale = 1;
  }

  getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  getBaseLog(x, y) {
    return Math.log(y) / Math.log(x);
  }

  update(dt) {
    super.update(dt);
    this.gold += 0.05;

    this.scale = 0.05 * (this.gold);
    if (this.scale < 0.5) {
      this.scale = 0.5;
    } else if (this.scale > 4) {
      this.scale = 4;
    }
    this.camHeight = 120*this.scale; 
    this.camRadius = 180*this.scale;

    this.calcShipAngle();
    this.moveForward();

    this.fireCooldown -= dt;

    if (this.fire) {
      this.fire = false;
      var cannonballs = [];
      //if (Math.abs(this.currTurnRate) <= 0.2 * Math.PI/180) {
        cannonballs.push(new Cannonball(this.id, this.x, this.z, this.cannonSpeed, this.speed, this.angleY, Math.PI/2, true, this.scale));
        cannonballs.push(new Cannonball(this.id, this.x, this.z, this.cannonSpeed, this.speed, this.angleY, -Math.PI/2, true, this.scale));
        cannonballs.push(new Cannonball(this.id, this.x + Math.sin(this.angleY) * -5*this.scale, this.z + Math.cos(this.angleY) * -5*this.scale, this.cannonSpeed, this.speed, this.angleY, Math.PI/2, true, this.scale));
        cannonballs.push(new Cannonball(this.id, this.x + Math.sin(this.angleY) * -5*this.scale, this.z + Math.cos(this.angleY) * -5*this.scale, this.cannonSpeed, this.speed, this.angleY, -Math.PI/2, true, this.scale));
        cannonballs.push(new Cannonball(this.id, this.x + Math.sin(this.angleY) * 5*this.scale, this.z + Math.cos(this.angleY) * 5*this.scale, this.cannonSpeed, this.speed, this.angleY, Math.PI/2, true, this.scale));
        cannonballs.push(new Cannonball(this.id, this.x + Math.sin(this.angleY) * 5*this.scale, this.z + Math.cos(this.angleY) * 5*this.scale, this.cannonSpeed, this.speed, this.angleY, -Math.PI/2, true, this.scale));
      // } else {
      //   cannonballs.push(new Cannonball(this.id, this.x, this.z, this.cannonSpeed, this.speed, this.angleY, Math.PI/2, false));
      //   cannonballs.push(new Cannonball(this.id, this.x, this.z, this.cannonSpeed, this.speed, this.angleY, -Math.PI/2, false));
      //   cannonballs.push(new Cannonball(this.id, this.x + Math.sin(this.angleY) * -5*this.scale, this.z + Math.cos(this.angleY) * -5*this.scale, this.cannonSpeed, this.speed, this.angleY, Math.PI/2, false, this.scale));
      //   cannonballs.push(new Cannonball(this.id, this.x + Math.sin(this.angleY) * -5*this.scale, this.z + Math.cos(this.angleY) * -5*this.scale, this.cannonSpeed, this.speed, this.angleY, -Math.PI/2, false, this.scale));
      //   cannonballs.push(new Cannonball(this.id, this.x + Math.sin(this.angleY) * 5*this.scale, this.z + Math.cos(this.angleY) * 5*this.scale, this.cannonSpeed, this.speed, this.angleY, Math.PI/2, false, this.scale));
      //   cannonballs.push(new Cannonball(this.id, this.x + Math.sin(this.angleY) * 5*this.scale, this.z + Math.cos(this.angleY) * 5*this.scale, this.cannonSpeed, this.speed, this.angleY, -Math.PI/2, false, this.scale));
      // }
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
      color: this.color,
      username: this.username,
      gold: this.gold,
      ship: this.ship,
      scale: this.scale,
    };
  }
}

module.exports = Player;
