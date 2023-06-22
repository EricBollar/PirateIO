import * as THREE from '../three/build/three.js';

export class Label {
    constructor(name) {
        const labelGeometry = new THREE.PlaneGeometry(5, 2, 1);
        this.canvas = this.makeLabelCanvas(name.length * 100, 300, name);
        const texture = new THREE.CanvasTexture(this.canvas);
        texture.minFilter = THREE.LinearFilter;
        texture.wrapS = THREE.ClampToEdgeWrapping;
        texture.wrapT = THREE.ClampToEdgeWrapping;
        const labelMaterial = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
        });
        this.label = new THREE.Mesh(labelGeometry, labelMaterial);
        this.name = name;
    }

    getObj() {
        return this.label;
    }

    scale(scale) {
        this.label.scale.x = this.name.length * scale;
        this.label.scale.y = 3 * scale;
    }

    position(x, y, z, scale) {
        this.label.position.set(x, y+41*scale, z);
    }

    rotate(camX, camY, camZ) {
        this.label.lookAt(camX, camY, camZ);
    }

    makeLabelCanvas(baseWidth, size, name) {
        const borderSize = 2;
        const ctx = document.createElement('canvas').getContext('2d');
        const font =  `${size}px helvetica`;
        ctx.font = font;
        // measure how long the name will be
        const textWidth = ctx.measureText(name).width;
    
        const doubleBorderSize = borderSize * 2;
        const width = baseWidth + doubleBorderSize;
        const height = size + doubleBorderSize;
        ctx.canvas.width = width;
        ctx.canvas.height = height;
    
        // need to set font again after resizing canvas
        ctx.font = font;
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'center';
    
        ctx.fillStyle = "rgba(60, 60, 60, .75)";
        ctx.beginPath();
        ctx.roundRect(0, 0, width+doubleBorderSize, height+doubleBorderSize, 50);
        ctx.stroke();
        ctx.fill();
        // ctx.fillRect(0, 0, width, height);
    
        // scale to fit but don't stretch
        const scaleFactor = Math.min(1, baseWidth / textWidth);
        ctx.translate(width / 2, height / 2);
        ctx.scale(scaleFactor, 1);
        ctx.fillStyle = 'white';
        ctx.fillText(name, 0, 0);
    
        return ctx.canvas;
    }
}