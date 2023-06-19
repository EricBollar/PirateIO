// export function createWarship(warship, scene, x, y, z, angleX, angleY, angleZ, colorStr, scale) {
//     warship.forEach(index => {
//       var color = colorStr.substring(0, 7);
//       var curr = index.clone();
//       curr.scale.set(scale, scale, scale);
//       curr.rotation.x = angleX;
//       curr.rotation.y = angleY;
//       curr.rotation.z = angleZ;
//       if (curr.name === "hull") { 
//         curr.children[0].material = index.children[0].material.clone();
//         curr.children[0].material.color.set(color);
//         curr.position.set(x, y, z)
//       } else if (curr.name === "mast1") {
//         curr.children[0].material = index.children[0].material.clone();
//         curr.children[0].material.color.set(color);
//         curr.position.set(x, y+8*scale, z);
//         curr.translateZ(10*scale);
//       } else if (curr.name === "mast2") {
//         curr.children[0].material = index.children[0].material.clone();
//         curr.children[0].material.color.set(color);
//         curr.position.set(x, y+6*scale, z);
//       } else if (curr.name === "mast3") {
//         curr.children[0].material = index.children[0].material.clone();
//         curr.children[0].material.color.set(color);
//         curr.position.set(x, y+11*scale, z);
//         curr.translateZ(-2-10*scale);
//       } else if (curr.name === "sails1") {
//         curr.children[0].material = index.children[0].material.clone();
//         curr.children[0].material.color.set(sailColor);
//         curr.position.set(x, y+8*scale, z);
//         curr.translateZ(10*scale);
//       } else if (curr.name === "sails2") {
//         curr.children[0].material = index.children[0].material.clone();
//         curr.children[0].material.color.set(sailColor);
//         curr.position.set(x, y+6*scale, z);
//       } else if (curr.name === "sails3") {
//         curr.children[0].material = index.children[0].material.clone();
//         curr.children[0].material.color.set(sailColor);
//         curr.position.set(x, y+11*scale, z);
//         curr.translateZ(-2-10*scale);
//       }
//       scene.add(curr);
//     });
//   }