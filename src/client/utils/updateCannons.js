export function updateCannons(me, cannon) {
    const {x, y, z, radius} = cannon;
    var n = bomb.clone();
    n.children[0].material = bomb.children[0].material.clone();
    n.children[0].material.color.set(0xFB9404);
    n.scale.set(radius, radius, radius);
    n.position.set(x, y, z);
    scene.add( n );
  }