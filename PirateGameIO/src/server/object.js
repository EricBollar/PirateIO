class Object {
  constructor(id, x, y) {
    this.id = id;
    this.x = x;
    this.y = y;
  }

  update(dt) {

  }

  serializeForUpdate() {
    return {
      id: this.id,
      x: this.x,
      y: this.y,
    };
  }
}

module.exports = Object;
