export function rotateWarship(shipObjectsToDraw, angleX, angleY, angleZ, camX, camY, camZ) {
    shipObjectsToDraw.forEach(shipPart => {
        if (shipPart.name.includes("label")) {
            shipPart.lookAt(camX, camY, camZ);
        } else if (shipPart.name.includes("healthbackground")) {
            shipPart.lookAt(camX, camY, camZ);
            shipPart.translateZ(-0.2);
        } else if (shipPart.name.includes("healthbar")) {
            shipPart.lookAt(camX, camY, camZ);
        } else {
            shipPart.rotation.set(angleX, angleY, angleZ);
        }
    })
}