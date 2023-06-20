import * as THREE from '../three/build/three.js';

export function createHealthBar(id) {
    var geometry = new THREE.PlaneGeometry( 16.5, 3.5, 1 );
    var material = new THREE.MeshBasicMaterial( {color: 0x52130B, side: THREE.DoubleSide} );
    var background = new THREE.Mesh( geometry, material );
    var geometry = new THREE.PlaneGeometry( 15, 2, 1 );
    var material = new THREE.MeshBasicMaterial( {color: 0x30dd22, side: THREE.DoubleSide} );
    var hp = new THREE.Mesh( geometry, material );
    background.name = id+"healthbackground";
    hp.name = id+"healthbar";
    return {hp: hp, background: background};
  }