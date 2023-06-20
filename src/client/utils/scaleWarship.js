import { scaleLabel } from "./makeLabelCanvas";

export function scaleWarship(shipObjectsToDraw, scale, health) {
    shipObjectsToDraw.forEach(shipPart => {
        if (shipPart.name.includes("label")) {
            scaleLabel(shipPart, scale);
        } else if (shipPart.name.includes("healthbar")) {
            shipPart.scale.set(health/100.0, scale, 1);
        } else {
            shipPart.scale.set(scale, scale, scale);
        }
    })
}