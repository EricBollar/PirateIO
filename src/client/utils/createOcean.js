
import { Ocean } from '../three/examples/jsm/misc/Ocean';
import * as THREE from '../three/build/three.js';

export function createOcean(renderer, camera, scene) {
    const gsize = 2048;
    const res = 512;
    const gres = res / 2;
    const origx = 0;
    const origz = 0;
    const ocean = new Ocean( renderer, camera, scene,
      {
        USE_HALF_FLOAT: false,
        INITIAL_SIZE: 2000.0,
        INITIAL_WIND: [ 10.0, 10.0 ],
        INITIAL_CHOPPINESS: 0.5,
        CLEAR_COLOR: [ 1.0, 1.0, 1.0, 0.0 ],
        GEOMETRY_ORIGIN: [ origx, origz ],
        SUN_DIRECTION: [ - 1.0, 1.0, 1.0 ],
        OCEAN_COLOR: new THREE.Vector3( 0.004, 0.016, 0.047 ),
        SKY_COLOR: new THREE.Vector3( 3.2, 9.6, 12.8 ),
        EXPOSURE: 0.35,
        GEOMETRY_RESOLUTION: gres,
        GEOMETRY_SIZE: gsize,
        RESOLUTION: res
      } );
  
    ocean.materialOcean.uniforms[ "u_projectionMatrix" ] = { value: camera.projectionMatrix };
    ocean.materialOcean.uniforms[ "u_viewMatrix" ] = { value: camera.matrixWorldInverse };
    ocean.materialOcean.uniforms[ "u_cameraPosition" ] = { value: camera.position };

    return ocean;
  }