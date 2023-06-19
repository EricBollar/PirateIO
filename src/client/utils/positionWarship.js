export function positionWarship(warship, x, y, z, scale) {
    warship.forEach(shipPart => {
        switch (shipPart.name) {
            case "hull": 
                shipPart.position.set(x, y, z); 
                break;
            case "mast1": 
                shipPart.position.set(x, y+8*scale, z); 
                shipPart.translateZ(10*scale);
                break;
            case "mast2": 
                shipPart.position.set(x, y+6*scale, z); 
                break;
            case "mast3": 
                shipPart.position.set(x, y+11*scale, z); 
                shipPart.translateZ(-2-10*scale); 
                break;
            case "sails1": 
                shipPart.position.set(x, y+8*scale, z); 
                shipPart.translateZ(10*scale); 
                break;
            case "sails2": 
                shipPart.position.set(x, y+6*scale, z); 
                break;
            case "sails3":
                shipPart.position.set(x, y+11*scale, z);
                shipPart.translateZ(-2-10*scale);
        }
    });
  }