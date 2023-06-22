import shortid from 'shortid';

export class Cannonball {
    constructor(id, radius, cannonballFiles) {
        this.ball = this.createCannonballObj(radius, cannonballFiles);
        this.id = id;
    }

    getObj() {
        return this.ball;
    }

    getId() {
        return this.id;
    }

    position(x, y, z) {
        this.ball.position.set(x, y, z);
    }

    createCannonballObj(radius, cannonballFiles) {
        let n = cannonballFiles.clone();
        n.children[0].material = cannonballFiles.children[0].material.clone();
        n.children[0].material.color.set(0xFB9404);
        n.scale.set(radius, radius, radius);
        n.position.set(0, -5, 0);
        return n;
    }
}