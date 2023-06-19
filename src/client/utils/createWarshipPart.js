export function createWarshipPart(shipPart, colorStr, scale, name) {
    var color = colorStr.substring(0, 7);
    var curr = shipPart.clone();

    curr.scale.set(scale, scale, scale);
    curr.rotation.set(0, 0, 0);
    
    curr.children[0].material = shipPart.children[0].material.clone();
    if (shipPart.name.includes("sails")) {
        curr.children[0].material.color.set("#ffffff");
    } else {
        curr.children[0].material.color.set(color);
    }
    curr.name = name + curr.name;
    curr.children[0].position.set(0, 0, 0);

    return curr;
  }