
import { Water } from '../three/examples/jsm/objects/Water';
import * as THREE from '../three/build/three.js';

export function createOcean(scene) {
    const waterGeometry = new THREE.PlaneGeometry( 2000, 2000 );
    
    const water = new Water(
      waterGeometry,
      {
        textureWidth: 2000,
        textureHeight: 2000,
        waterNormals: new THREE.TextureLoader().load( '/waternormals.jpg', function ( texture ) {
    
          texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    
        } ),
        sunDirection: new THREE.Vector3(),
        sunColor: 0xffffff,
        waterColor: 0x001e0f,
        distortionScale: 6,
        fog: scene.fog !== undefined
      }
    );
    
    water.position.set(0, 3, 0);
    water.rotation.x = - Math.PI / 2;

    return water;
}