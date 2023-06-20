export function createCannonball(id, radius, cannonballFiles) {
    var n = cannonballFiles.clone();
    n.children[0].material = cannonballFiles.children[0].material.clone();
    n.children[0].material.color.set(0xFB9404);
    n.scale.set(radius, radius, radius);
    n.position.set(0, 10, 0);
    n.name = id+"cannonball";
    return n;
  }