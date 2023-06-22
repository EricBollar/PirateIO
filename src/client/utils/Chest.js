export class Chest {
    constructor(chestFiles, id) {
        this.id = id;
        const color = 0x956013;
        var curr = chestFiles.lid.clone();
        curr.scale.set(25, 25, 25);
        curr.children[0].material = chestFiles.lid.children[0].material.clone();
        curr.children[0].material.color.set(color);
        curr.position.set(0, 0, 0);
        curr.translateZ(-5);
        this.lid = curr;
        curr = chestFiles.chest.clone();
        curr.scale.set(25, 25, 25);
        curr.children[0].material = chestFiles.chest.children[0].material.clone();
        curr.children[0].material.color.set(color);
        curr.position.set(0, 0, 0);
        this.chest = curr;
    }

    getId() {
        return this.id;
    }

    getLid() {
        return this.lid;
    }

    getChest() {
        return this.chest;
    }

    position(x, y, z) {
        this.lid.position.set(x, y+5, z);
        this.lid.translateZ(-5);
        this.chest.position.set(x, y, z);
    }

    rotate(angle) {
        this.lid.rotation.y = angle;
        this.chest.rotation.y = angle;
    }
}