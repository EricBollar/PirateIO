import { OBJLoader } from '../three/examples/jsm/loaders/OBJLoader';

export async function loadFiles() {
    console.log("Loading files...");

    const loader = new OBJLoader();
    const shipFiles = await loadShip(loader);
    const cannonballFiles = await loadCannonball(loader);
    const rockFiles = await loadRock(loader);
    
    console.log("Assets Loaded!");
    return {shipFiles, cannonballFiles, rockFiles};
}

async function loadRock(loader) {
    return await loader.loadAsync( '/OBJ/SM_Env_Rock_Large_04.obj', function ( object ) {
        return object;
    });
}

async function loadCannonball(loader) {
    return await loader.loadAsync( '/OBJ/SM_Prop_CannonBalls_01.obj', function ( object ) {
        return object;
    });
}

async function loadShip(loader) {
    const hull = await loadOBJ("../OBJ/SM_Veh_Boat_Warship_01_Hull_Pirate.obj", loader);
    const mast1 = await loadOBJ("../OBJ/SM_Veh_Boat_Warship_01_Mast_01_Pirate.obj", loader);
    const mast2 = await loadOBJ("../OBJ/SM_Veh_Boat_Warship_01_Mast_02_Pirate.obj", loader);
    const mast3 = await loadOBJ("../OBJ/SM_Veh_Boat_Warship_01_Mast_03_Pirate.obj", loader);
    const sails1 = await loadOBJ("../OBJ/SM_Veh_Boat_Warship_01_Sails_01_Pirate.obj", loader);
    const sails2 = await loadOBJ("../OBJ/SM_Veh_Boat_Warship_01_Sails_02_Pirate.obj", loader);
    const sails3 = await loadOBJ("../OBJ/SM_Veh_Boat_Warship_01_Sails_03_Pirate.obj", loader);

    // i tried putting these within loadShipPart but it wouldn't work for some reason...
    hull.name = "hull";
    mast1.name = "mast1";
    mast2.name = "mast2";
    mast3.name = "mast3";
    sails1.name = "sails1";
    sails2.name = "sails2";
    sails3.name = "sails3";
    
    return [hull, mast1, mast2, mast3, sails1, sails2, sails3];
}

async function loadOBJ(filePath, loader) {
    return await loader.loadAsync(filePath, function (object) {
        return object;
    });
}