export function drawBeach() {
    for (var i = 0; i < 41; i++) {
      var curr = beach.clone();
      curr.position.set(1010, 1, -1000 + 50 * i);
      curr.scale.set(2, 2, 2);
      curr.rotation.x = 0;
      curr.rotation.y = 17*Math.PI/12;
      curr.rotation.z = 0;
      curr.children[0].material = beach.children[0].material.clone();
      curr.children[0].material.color.set(0x5f7815);
      scene.add(curr);
    }
    for (var i = 0; i < 41; i++) {
      var curr = beach.clone();
      curr.position.set(-1010, 1, -1000 + 50 * i);
      curr.scale.set(2, 2, 2);
      curr.rotation.x = 0;
      curr.rotation.y = 17*Math.PI/12 + Math.PI;
      curr.rotation.z = 0;
      curr.children[0].material = beach.children[0].material.clone();
      curr.children[0].material.color.set(0x5f7815);
      scene.add(curr);
    }
    for (var i = 0; i < 41; i++) {
      var curr = beach.clone();
      curr.position.set(-1000 + 50 * i, 1, 1010);
      curr.scale.set(2, 2, 2);
      curr.rotation.x = 0;
      curr.rotation.y = 17*Math.PI/12 - Math.PI/2;
      curr.rotation.z = 0;
      curr.children[0].material = beach.children[0].material.clone();
      curr.children[0].material.color.set(0x5f7815);
      scene.add(curr);
    }
    for (var i = 0; i < 41; i++) {
      var curr = beach.clone();
      curr.position.set(-1000 + 50 * i, 1, -1010);
      curr.scale.set(2, 2, 2);
      curr.rotation.x = 0;
      curr.rotation.y = 17*Math.PI/12 + Math.PI/2;
      curr.rotation.z = 0;
      curr.children[0].material = beach.children[0].material.clone();
      curr.children[0].material.color.set(0x5f7815);
      scene.add(curr);
    }
  }