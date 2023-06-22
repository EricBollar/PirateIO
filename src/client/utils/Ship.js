export class Ship {
    constructor(shipFiles, color, scale, id) {
        this.parts = [];
        shipFiles.forEach(obj => {
            this.parts.push(this.createPart(obj, color, scale, id))
        });;
    }

    getParts() {
        return this.parts;
    }

    createPart(obj, colorStr, scale, name) {
        const color = colorStr.substring(0, 7);
        const part = obj.clone();

        part.scale.set(scale, scale, scale);
        part.rotation.set(0, 0, 0);
        
        part.children[0].material = part.children[0].material.clone();
        if (obj.name.includes("sails")) {
            part.children[0].material.color.set("#ffffff");
        } else {
            part.children[0].material.color.set(color);
        }
        part.name = name + part.name;
        part.children[0].position.set(0, 0, 0);

        return part;
    }

    position(x, y, z, scale) {
        this.parts.forEach(part => {
            const name = part.name;
            if (name.includes("hull")) {
                part.position.set(x, y-Math.pow(scale, 1.4), z); 
            } else if (name.includes("mast1")) {
                part.position.set(x, y+8*scale-Math.pow(scale, 1.4), z); 
                part.translateZ(10*scale);
            } else if (name.includes("mast2")) {
                part.position.set(x, y+6*scale-Math.pow(scale, 1.4), z); 
            } else if (name.includes("mast3")) {
                part.position.set(x, y+11*scale-Math.pow(scale, 1.4), z); 
                part.translateZ(-2-10*scale);
            } else if (name.includes("sails1")) {
                part.position.set(x, y+8*scale-Math.pow(scale, 1.4), z); 
                part.translateZ(10*scale); 
            } else if (name.includes("sails2")) {
                part.position.set(x, y+6*scale-Math.pow(scale, 1.4), z); 
            } else if (name.includes("sails3")) {
                part.position.set(x, y+11*scale-Math.pow(scale, 1.4), z);
                part.translateZ(-2-10*scale);
            }
        });
    }

    rotate(angleX, angleY, angleZ, camX, camY, camZ) {
        this.parts.forEach(part => {
            part.rotation.set(angleX, angleY, angleZ);
        })
    }

    scale(scale) {
        this.parts.forEach(part => {
            part.scale.set(scale, scale, scale);
        })
    }
}