import { Water } from '../three/examples/jsm/objects/Water';
import * as THREE from '../three/build/three.js';

export class Ocean {
    constructor(dimensions) {
        const oceanGeometry = new THREE.PlaneGeometry( dimensions, dimensions );

        this.ocean = new Water(
        oceanGeometry,
        {
            textureWidth: 2000,
            textureHeight: 2000,
            waterNormals: new THREE.TextureLoader().load( '/waternormals.jpg', function ( texture ) {
        
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        
            } ),
            sunDirection: new THREE.Vector3(),
            sunColor: 0xffffff,
            waterColor: 0x001e0f,
            distortionScale: 6
        }
        );
        
        this.ocean.position.set(0, 3, 0);
        this.ocean.rotation.x = - Math.PI / 2;
    }

    getObj() {
        return this.ocean;
    }

    update(dt) {
        this.ocean.material.uniforms[ 'time' ].value += dt;
    }
}