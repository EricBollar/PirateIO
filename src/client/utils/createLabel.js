// export function createLabel(x, y, z, name, camX, camHeight, camZ, scale) {
//     const labelGeometry = new THREE.PlaneGeometry(scale*5, scale*2, 1);
//     const canvas = makeLabelCanvas(300, 300, name);
//     const texture = new THREE.CanvasTexture(canvas);
//     texture.minFilter = THREE.LinearFilter;
//     texture.wrapS = THREE.ClampToEdgeWrapping;
//     texture.wrapT = THREE.ClampToEdgeWrapping;
//     const labelMaterial = new THREE.MeshBasicMaterial({
//       map: texture,
//       side: THREE.DoubleSide,
//       transparent: true,
//     });
//     const label = new THREE.Mesh(labelGeometry, labelMaterial);
//     scene.add(label);
//     label.position.set(x, y+41*scale, z);
//     label.lookAt(camX, camHeight, camZ);
//     label.scale.x = canvas.width * 0.01;
//     label.scale.y = canvas.height * 0.01;
//   }