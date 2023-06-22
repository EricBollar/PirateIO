import * as THREE from '../three/build/three.js';

export class Healthbar {
    constructor() {
        const bgGeometry = new THREE.PlaneGeometry( 16.5, 3.5, 1 );
        const bgMaterial = new THREE.MeshBasicMaterial( {color: 0x52130B, side: THREE.DoubleSide} );
        this.bg = new THREE.Mesh( bgGeometry, bgMaterial );

        const hpGeometry = new THREE.PlaneGeometry( 15, 2, 1 );
        const hpMaterial = new THREE.MeshBasicMaterial( {color: 0x30dd22, side: THREE.DoubleSide} );
        this.hp = new THREE.Mesh( hpGeometry, hpMaterial );
    }

    getBackground() {
        return this.bg;
    }

    getHp() {
        return this.hp;
    }

    position(x, y, z, scale) {
        this.bg.position.set(x, y+35*scale, z);
        this.hp.position.set(x, y+35*scale, z);
    }

    rotate(camX, camY, camZ) {
        this.bg.lookAt(camX, camY, camZ);
        this.bg.translateZ(-0.2);
        this.hp.lookAt(camX, camY, camZ);
    }

    scale(scale, health) {
        this.hp.scale.set(scale * health/100.0, scale, scale);
        this.bg.scale.set(scale, scale, scale);
    }
}