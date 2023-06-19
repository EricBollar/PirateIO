const ObjectClass = require('./object');
const Cannonball = require('./cannonball');
const Chest = require('./chest');
const Constants = require('../shared/constants');

class Player extends ObjectClass {
  constructor(id, username, x, z) {
    super(id);
    this.username = username;
    this.scale = 1;

    // position and rotation
    this.x = x;
    this.y = 0;
    this.z = z;
    this.angleX = 0;
    this.angleY = 0;
    this.angleZ = 0;

    // turning animation
    this.shouldTurnRight = false,
    this.shouldTurnLeft = false,
    this.currTurnRate = 0,
    this.maxTurnRate = Math.PI / 180,
    this.turnAcceleration = 0.025 * Math.PI / 180,
    
    // camera position
    this.camX = 0,
    this.camY = 70,
    this.camZ = 0,
    this.camAngle = 0,
    this.camAngleStep = 3 * Math.PI/180,
    this.camRadius = 160,
    this.camTurningLeft = false,
    this.camTurningRight = false,
    
    // movement speed
    this.speed = 0.8,

    // cannon related
    this.cannonSpeed = 1,
    this.reloadTime = 1,
    this.fireCooldown = 0,
    this.fire = false,

    // other
    this.health = 100,
    this.time = 0,
    this.gold = 0
  }

  // getBaseLog(x, y) {
  //   return Math.log(y) / Math.log(x);
  // }

  update(dt) {
    super.update(dt);
    // this.gold += 0.01;
    // this.speed = 0.75 * Math.pow(Math.E, -0.005 * this.gold);

    // this.scale = 0.02 * (this.gold);
    // if (this.scale < 1) {
    //   this.scale = 1;
    // } else if (this.scale > 4) {
    //   this.scale = 4;
    // }
    // this.camHeight = 120*this.scale - 5 * this.scale * this.scale; 
    // this.camRadius = 180*this.scale - 5 * this.scale * this.scale;

    // this.calcShipAngle();

    this.handleMovement();
    this.handleCameraRotation();
    this.calcShipAngle();

    // this.fireCooldown -= dt;

    // if (this.fire) {
    //   this.fire = false;
    //   var cannonballs = [];
    //   //if (Math.abs(this.currTurnRate) <= 0.2 * Math.PI/180) {
    //     cannonballs.push(new Cannonball(this.id, this.x, this.z, this.cannonSpeed, this.speed, this.angleY, Math.PI/2, true, this.scale));
    //     cannonballs.push(new Cannonball(this.id, this.x, this.z, this.cannonSpeed, this.speed, this.angleY, -Math.PI/2, true, this.scale));
    //     cannonballs.push(new Cannonball(this.id, this.x + Math.sin(this.angleY) * -5*this.scale, this.z + Math.cos(this.angleY) * -5*this.scale, this.cannonSpeed, this.speed, this.angleY, Math.PI/2, true, this.scale));
    //     cannonballs.push(new Cannonball(this.id, this.x + Math.sin(this.angleY) * -5*this.scale, this.z + Math.cos(this.angleY) * -5*this.scale, this.cannonSpeed, this.speed, this.angleY, -Math.PI/2, true, this.scale));
    //     cannonballs.push(new Cannonball(this.id, this.x + Math.sin(this.angleY) * 5*this.scale, this.z + Math.cos(this.angleY) * 5*this.scale, this.cannonSpeed, this.speed, this.angleY, Math.PI/2, true, this.scale));
    //     cannonballs.push(new Cannonball(this.id, this.x + Math.sin(this.angleY) * 5*this.scale, this.z + Math.cos(this.angleY) * 5*this.scale, this.cannonSpeed, this.speed, this.angleY, -Math.PI/2, true, this.scale));
      // } else {
      //   cannonballs.push(new Cannonball(this.id, this.x, this.z, this.cannonSpeed, this.speed, this.angleY, Math.PI/2, false));
      //   cannonballs.push(new Cannonball(this.id, this.x, this.z, this.cannonSpeed, this.speed, this.angleY, -Math.PI/2, false));
      //   cannonballs.push(new Cannonball(this.id, this.x + Math.sin(this.angleY) * -5*this.scale, this.z + Math.cos(this.angleY) * -5*this.scale, this.cannonSpeed, this.speed, this.angleY, Math.PI/2, false, this.scale));
      //   cannonballs.push(new Cannonball(this.id, this.x + Math.sin(this.angleY) * -5*this.scale, this.z + Math.cos(this.angleY) * -5*this.scale, this.cannonSpeed, this.speed, this.angleY, -Math.PI/2, false, this.scale));
      //   cannonballs.push(new Cannonball(this.id, this.x + Math.sin(this.angleY) * 5*this.scale, this.z + Math.cos(this.angleY) * 5*this.scale, this.cannonSpeed, this.speed, this.angleY, Math.PI/2, false, this.scale));
      //   cannonballs.push(new Cannonball(this.id, this.x + Math.sin(this.angleY) * 5*this.scale, this.z + Math.cos(this.angleY) * 5*this.scale, this.cannonSpeed, this.speed, this.angleY, -Math.PI/2, false, this.scale));
      // }
    //   return cannonballs;
    // }

    
    return null;
  }

  handleCameraRotation() {
    if (this.camTurningRight && !this.camTurningLeft) {
      this.updateCamera(this.camAngleStep);
    } else if (this.camTurningLeft && !this.camTurningRight) {
      this.updateCamera(-this.camAngleStep);
    } else {
      this.updateCamera(0);
    }
  }

  updateCamera(x) {
    this.camAngle += x;
    this.camX = Math.sin(this.camAngle) * this.camRadius + this.x;
    this.camZ = Math.cos(this.camAngle) * -this.camRadius + this.z;
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

  createChest() {
    var chests = [];
    var ran = 0;
    for (let i = this.gold+50; i > 0; i -= 50) {
      ran += 15;
      if (ran > 60) {
        ran = 60;
      }
      chests.push(new Chest(this.id, this.x+Math.random()*ran, this.z+Math.random()*ran));
    }
    return chests;
  }

  camTurnRight(bool) {
    this.camTurningRight = bool;
  }

  camTurnLeft(bool) {
    this.camTurningLeft = bool;
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

  

  handleMovement() {
    if (this.x > 980 && this.angleY < Math.PI || this.x < -980 && this.angleY > Math.PI) {
      if (this.z < 980 && this.z > -980) {
        this.z += Math.cos(this.angleY) * this.speed;
      }
    } else if (this.z > 980 && this.angleY < Math.PI/2 || this.z > 980 && this.angleY > 3*Math.PI/2) {
      if (this.x < 980 && this.x > -980) {
        this.x += Math.sin(this.angleY) * this.speed;
      }
    } else if (this.z < -980 && this.angleY > Math.PI/2 && this.angleY < 3*Math.PI/2) {
      if (this.x < 980 && this.x > -980) {
        this.x += Math.sin(this.angleY) * this.speed;
      }
    } else {
      this.x += Math.sin(this.angleY) * this.speed;
      this.z += Math.cos(this.angleY) * this.speed;
    }
  }

  calcShipAngle() {
    let prev = {x: this.angleX, y: this.angleY, z: this.angleZ};

    // turning left
    if (this.shouldTurnLeft && !this.shouldTurnRight) {
      // if still increasing turn
      if (this.currTurnRate < this.maxTurnRate) {
        this.currTurnRate += this.turnAcceleration;
      }
      // adjust angle accordingly
      this.angleY += this.currTurnRate;

    // turning right
    } else if (this.shouldTurnRight && !this.shouldTurnLeft) {
      // if still increasing turn
      if (this.currTurnRate > -this.maxTurnRate) {
        this.currTurnRate -= this.turnAcceleration;
      }
      // adjust angle
      this.angleY += this.currTurnRate;
    // not actively turning
    } else {
      // straightening out?
      if (this.currTurnRate > 0) {
        this.currTurnRate -= 0.025 * Math.PI / 180;;
        this.angleY += this.currTurnRate;
      } else {
        this.currTurnRate += 0.025 * Math.PI / 180;;
        this.angleY += this.currTurnRate;
      }
    }
    this.angleZ = this.currTurnRate * 10;
    if (Math.abs(this.angleX - prev.x) > 1 || Math.abs(this.angleY - prev.y) > 1 || Math.abs(this.angleZ - prev.z) > 1) {
      console.log(this.angleX, this.angleY, this.angleZ);
      console.log("prev below, actual above");
      console.log(prev.x, prev.y, prev.z);
      console.log(this.currTurnRate, "currTurnRate");
      console.log(this.turnAcceleration, "turnAccelration");
    }
  }
    
  serializeForUpdate() {
    return {
      ...(super.serializeForUpdate()),
      username: this.username,
      scale: this.scale,

      // position and rotation
      x: this.x,
      y: this.y,
      z: this.z,
      angleX: this.angleX,
      angleY: this.angleY,
      angleZ: this.angleZ,

      // turning animation
      shouldTurnLeft: this.shouldTurnLeft,
      shouldTurnRight: this.shouldTurnRight,
      currTurnRate: this.currTurnRate,
      maxTurnRate: this.maxTurnRate,
      turnAcceleration: this.turnAcceleration,
      
      // camera position
      camX: this.camX,
      camY: this.camY,
      camZ: this.camZ,
      camAngle: this.camAngle,
      camAngleStep: this.camAngleStep,
      camRadius: this.camRadius,
      camTurningLeft: this.camTurningLeft,
      camTurningRight: this.camTurningRight,
      
      // movement speed
      speed: this.speed,

      // cannon related
      cannonSpeed: this.cannonSpeed,
      reloadTime: this.reloadTime,
      fireCooldown: this.fireCooldown,
      fire: this.fire,

      // other
      health: this.health,
      time: this.time,
      gold: this.gold
    };
  }
}

module.exports = Player;
