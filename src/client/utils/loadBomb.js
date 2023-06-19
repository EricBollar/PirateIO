var bomb;
export function loadBomb() {
  var loader = new OBJLoader();
	loader.load( '/assets/OBJ/SM_Prop_CannonBalls_01.obj', function ( object ) {
    object.name = "bomb";
    bomb = object;
  });
}