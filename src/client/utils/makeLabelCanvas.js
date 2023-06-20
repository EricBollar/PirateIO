import * as THREE from '../three/build/three.js';

export function createLabel(name, scale, id) {
    const labelGeometry = new THREE.PlaneGeometry(scale*5, scale*2, 1);
    const canvas = makeLabelCanvas(name.length * 100, 300, name);
    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    const labelMaterial = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
    });
    const label = new THREE.Mesh(labelGeometry, labelMaterial);
    label.name = id + "label---" + name;
    return {canvas: canvas, label: label};
}

export function scaleLabel(label, scale) {
    const breakIndex = label.name.indexOf("---");
    const username = label.name.substring(breakIndex+3);
    
    label.scale.x = username.length * scale;
    label.scale.y = 3 * scale;
}

function makeLabelCanvas(baseWidth, size, name) {
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