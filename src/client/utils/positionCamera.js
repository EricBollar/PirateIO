export function updateCam(camera, x, y, z) {
    camera.position.set(camX, camHeight, camZ);
    camera.lookAt(x, 0, z);
}