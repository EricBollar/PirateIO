export function createChest(x, y, z, angle) {
    chest.forEach(index => {
      var color = 0x956013;
      var curr = index.clone();
      curr.scale.set(25, 25, 25);
      curr.children[0].material = index.children[0].material.clone();
      curr.children[0].material.color.set(color);
      curr.rotation.y = angle;
      if (curr.name === "lid") {
        curr.position.set(x, y+5, z);
        curr.translateZ(-5);
      } else if (curr.name === "chest") {
        curr.position.set(x, y, z);
      }
      scene.add(curr);
    });
  }