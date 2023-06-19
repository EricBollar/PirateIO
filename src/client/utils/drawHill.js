export function drawHill() {
    for (var i = 0; i < 21; i++) {
      var curr = hill.clone();
      curr.position.set(1100, 1, -1000 + 100 * i);
      curr.scale.set(2, 2, 2);
      curr.rotation.x = 0;
      curr.rotation.y = 17*Math.PI/12 + Math.PI/2;
      curr.rotation.z = 0;
      curr.children[0].material = hill.children[0].material.clone();
      curr.children[0].material.color.set(0x946833);
      scene.add(curr);
    }
    for (var i = 0; i < 21; i++) {
      var curr = hill.clone();
      curr.position.set(-1100, 1, -1000 + 100 * i);
      curr.scale.set(2, 2, 2);
      curr.rotation.x = 0;
      curr.rotation.y = 17*Math.PI/12 - Math.PI/2;
      curr.rotation.z = 0;
      curr.children[0].material = hill.children[0].material.clone();
      curr.children[0].material.color.set(0x946833);
      scene.add(curr);
    }
    for (var i = 0; i < 21; i++) {
      var curr = hill.clone();
      curr.position.set(-1000 + 100 * i, 1, 1100);
      curr.scale.set(2, 2, 2);
      curr.rotation.x = 0;
      curr.rotation.y = 17*Math.PI/12;
      curr.rotation.z = 0;
      curr.children[0].material = hill.children[0].material.clone();
      curr.children[0].material.color.set(0x946833);
      scene.add(curr);
    }
    for (var i = 0; i < 21; i++) {
      var curr = hill.clone();
      curr.position.set(-1000 + 100 * i, 1, -1100);
      curr.scale.set(2, 2, 2);
      curr.rotation.x = 0;
      curr.rotation.y = 17*Math.PI/12 + Math.PI;
      curr.rotation.z = 0;
      curr.children[0].material = hill.children[0].material.clone();
      curr.children[0].material.color.set(0x946833);
      scene.add(curr);
    }
  }