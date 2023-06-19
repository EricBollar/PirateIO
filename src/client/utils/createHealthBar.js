export function createHealthBar(x, y, z, health, camX, camHeight, camZ, scale) {
    var geometry = new THREE.PlaneGeometry( scale*16.5, 3.5*scale, 1 );
    var material = new THREE.MeshBasicMaterial( {color: 0x52130B, side: THREE.DoubleSide} );
    var background = new THREE.Mesh( geometry, material );
    scene.add( background );
    background.position.set(x, y+35*scale, z);
    background.lookAt(camX, camHeight, camZ);
    background.translateZ(-0.1);
    var geometry = new THREE.PlaneGeometry( health/100.0 * scale*15, 2*scale, 1 );
    var material = new THREE.MeshBasicMaterial( {color: 0x30dd22, side: THREE.DoubleSide} );
    var hp = new THREE.Mesh( geometry, material );
    scene.add( hp );
    hp.position.set(x, y+35*scale, z);
    hp.lookAt(camX, camHeight, camZ);
  }