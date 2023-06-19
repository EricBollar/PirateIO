import { OBJLoader } from '../three/examples/jsm/loaders/OBJLoader';

export async function loadWarship() {

    const hull = await loadShipPart("../OBJ/SM_Veh_Boat_Warship_01_Hull_Pirate.obj");
    const mast1 = await loadShipPart("../OBJ/SM_Veh_Boat_Warship_01_Mast_01_Pirate.obj");
    const mast2 = await loadShipPart("../OBJ/SM_Veh_Boat_Warship_01_Mast_02_Pirate.obj");
    const mast3 = await loadShipPart("../OBJ/SM_Veh_Boat_Warship_01_Mast_03_Pirate.obj");
    const sails1 = await loadShipPart("../OBJ/SM_Veh_Boat_Warship_01_Sails_01_Pirate.obj");
    const sails2 = await loadShipPart("../OBJ/SM_Veh_Boat_Warship_01_Sails_02_Pirate.obj");
    const sails3 = await loadShipPart("../OBJ/SM_Veh_Boat_Warship_01_Sails_03_Pirate.obj");

    // i tried putting these within loadShipPart but it wouldn't work for some reason...
    hull.name = "hull";
    mast1.name = "mast1";
    mast2.name = "mast2";
    mast3.name = "mast3";
    sails1.name = "sails1";
    sails2.name = "sails2";
    sails3.name = "sails3";
    
    const out = [hull, mast1, mast2, mast3, sails1, sails2, sails3];
    return out;
}

const loader = new OBJLoader();
async function loadShipPart(filePath, objectName) {
    return await loader.loadAsync(filePath, function (object) {
        object.name = objectName;
        return object;
    });
}