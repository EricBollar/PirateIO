import * as THREE from '../three/build/three.js';

export function createScene(canvas, scene, renderer, camera) {
    renderer.setClearColor( 0x11a6ee, 1 );
    camera.far = 3000;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight - 32);
    document.body.appendChild(renderer.domElement);
    canvas.style.cursor = 'default';
    var light = new THREE.HemisphereLight( 0xf9f9f9, 0x080820, 1 );
    scene.add( light );
    light = new THREE.DirectionalLight(0xffffff, 1.0);
    light.position.set(0, 100, 0);
    scene.add(light);
  }