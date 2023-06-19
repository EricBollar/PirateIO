export function positionWarship(warship, x, y, z, scale) {
    warship.forEach(shipPart => {
        if (shipPart.name.includes("hull")) {
            shipPart.position.set(x, y, z); 
        } else if (shipPart.name.includes("mast1")) {
            shipPart.position.set(x, y+8*scale, z); 
            shipPart.translateZ(10*scale);
        } else if (shipPart.name.includes("mast2")) {
            shipPart.position.set(x, y+6*scale, z); 
        } else if (shipPart.name.includes("mast3")) {
            shipPart.position.set(x, y+11*scale, z); 
            shipPart.translateZ(-2-10*scale);
        } else if (shipPart.name.includes("sails1")) {
            shipPart.position.set(x, y+8*scale, z); 
            shipPart.translateZ(10*scale); 
        } else if (shipPart.name.includes("sails2")) {
            shipPart.position.set(x, y+6*scale, z); 
        } else if (shipPart.name.includes("sails3")) {
            shipPart.position.set(x, y+11*scale, z);
            shipPart.translateZ(-2-10*scale);
        }
    });
  }