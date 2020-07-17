// Eric Bollar

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight - 32);
document.body.appendChild(renderer.domElement);
var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 500);
var scene = new THREE.Scene();
camera.position.set(0, 0, -10);
camera.lookAt(0, 0, 0);
createSky(0x1ecbe1);

var geometry = new THREE.BoxGeometry( 1, 1, 1 );
var material = new THREE.MeshLambertMaterial( {color: 0x00ff00} );
var cube = new THREE.Mesh( geometry, material );
scene.add( cube );

var geometry = new THREE.BoxGeometry( 3, 3, 3 );
var material = new THREE.MeshLambertMaterial( {color: 0x00fff0} );
var cube2 = new THREE.Mesh( geometry, material );
cube2.position.set(3, 1, 4);
scene.add( cube2 );

var geometry = new THREE.PlaneGeometry( 100, 100, 32 );
var material = new THREE.MeshLambertMaterial( {color: 0x1873e7, side: THREE.DoubleSide} );
var plane = new THREE.Mesh( geometry, material );
plane.position.set(0, -1, 0);
plane.rotation.set(Math.PI/2, 0, 0);
scene.add( plane );

window.onkeydown = keyDown;
window.onkeyup = keyUp;
window.onmousemove = mouseMove;

var prevX = 0;
var prevY = 0;
var angleXZ = 0;
var step = 0.01;
var radius = 15;
var height = 15;
var center = cube.position;
function mouseMove() {
    var x = event.clientX;
    var y = event.clientY;

    if (x - prevX !== 0) {
        angleXZ += step * (x - prevX);
        updateCamera(x - prevX);
    }

    prevX = x;
    prevY = y;
}

function updateCamera(amount) {
    center = cube.position;
    camera.position.x = Math.sin(angleXZ) * radius;
    camera.position.z = Math.cos(angleXZ) * -radius;
    camera.position.x += center.x;
    camera.position.z += center.z;
    camera.position.y = center.y + height;
    camera.lookAt(center);
}

var wDown = false;
var aDown = false;
var sDown = false;
var dDown = false;
var currSpeed = 0;
var maxSpeed = 0.4;
var acceleration = 0.15;
var decceleration = 0.005;
var currAngle = 0;
var maxAngle = 45 * Math.PI/180;
var turnAccel = 2 * Math.PI/180;
var turnDeccel = 1.5 * Math.PI/180;
function movement() {
    if (wDown) {
        if (currSpeed < maxSpeed) {
            currSpeed += acceleration;
        }
        if (currSpeed > maxSpeed) {
            currSpeed = maxSpeed;
        }
    } else if (sDown) {
        if (currSpeed > 0) {
            currSpeed -= decceleration;
        }
        if (currSpeed < 0) {
            currSpeed = 0;
        }
    } else {
        /*
        if (currSpeed > 0) {
            currSpeed -= decceleration;
        }
        if (currSpeed < 0) {
            currSpeed = 0;
        }*/
    }
    if (aDown) {
        currAngle += turnAccel;
    } else if (dDown) {
        currAngle -= turnAccel;
    } else {
        
    }
    cube.translateZ(currSpeed);
    cube.rotation.y = currAngle;
    updateCamera(0);
}

function keyDown() {
    if (event.keyCode === 87) {
        wDown = true;
    } else if (event.keyCode === 65) {
        aDown = true;
    } else if (event.keyCode === 83) {
        sDown = true;
    } else if (event.keyCode === 68) {     
        dDown = true;
    }
    updateCamera(0);
}

function keyUp() {
    if (event.keyCode === 87) {
        wDown = false;
    } else if (event.keyCode === 65) {
        aDown = false;
    } else if (event.keyCode === 83) {
        sDown = false;
    } else if (event.keyCode === 68) {     
        dDown = false;
    }
}

animate();

function createSky(skycolor) {
    var light = new THREE.HemisphereLight( skycolor, 0x080820, 1 );
    scene.add( light );
}

function animate() {
    requestAnimationFrame( animate );
    renderer.render( scene, camera );
    movement();
}