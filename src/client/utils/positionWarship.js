export function positionWarship(warship, x, y, z, scale) {
    warship.forEach(shipPart => {
        if (shipPart.name.includes("hull")) {
            shipPart.position.set(x, y-Math.pow(scale, 1.4), z); 
        } else if (shipPart.name.includes("mast1")) {
            shipPart.position.set(x, y+8*scale-Math.pow(scale, 1.4), z); 
            shipPart.translateZ(10*scale);
        } else if (shipPart.name.includes("mast2")) {
            shipPart.position.set(x, y+6*scale-Math.pow(scale, 1.4), z); 
        } else if (shipPart.name.includes("mast3")) {
            shipPart.position.set(x, y+11*scale-Math.pow(scale, 1.4), z); 
            shipPart.translateZ(-2-10*scale);
        } else if (shipPart.name.includes("sails1")) {
            shipPart.position.set(x, y+8*scale-Math.pow(scale, 1.4), z); 
            shipPart.translateZ(10*scale); 
        } else if (shipPart.name.includes("sails2")) {
            shipPart.position.set(x, y+6*scale-Math.pow(scale, 1.4), z); 
        } else if (shipPart.name.includes("sails3")) {
            shipPart.position.set(x, y+11*scale-Math.pow(scale, 1.4), z);
            shipPart.translateZ(-2-10*scale);
        } else if (shipPart.name.includes("label")) {
            shipPart.position.set(x, y+41*scale, z);
        } else if (shipPart.name.includes("healthbackground")) {
            shipPart.position.set(x, y+35*scale, z);
        } else if (shipPart.name.includes("healthbar")) {
            shipPart.position.set(x, y+35*scale, z);
        }
    });
  }