class Object {
  constructor(id) {
    this.id = id;
  }

  update(dt) {

  }

  serializeForUpdate() {
    return {
      id: this.id,
    };
  }
}

module.exports = Object;
