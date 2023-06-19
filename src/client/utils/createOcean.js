
import { Water } from '../three/examples/jsm/objects/Water';
import * as THREE from '../three/build/three.js';

export function createOcean(scene) {
    const waterGeometry = new THREE.PlaneGeometry( 10000, 10000 );
    
    const water = new Water(
      waterGeometry,
      {
        textureWidth: 2048,
        textureHeight: 2048,
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