import { OBJLoader } from '../three/examples/jsm/loaders/OBJLoader';

export async function loadCannonball() {
  var loader = new OBJLoader();
  return await loader.loadAsync( '/OBJ/SM_Prop_CannonBalls_01.obj', function ( object ) {
    object.name = "cannonball";
    return object;
  });
}