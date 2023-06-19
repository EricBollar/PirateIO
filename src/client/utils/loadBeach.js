var beach;
export function loadBeach() {
  var loader = new OBJLoader();
	loader.load( '/assets/OBJ/SM_Env_Beach_04.obj', function ( object ) {
    object.name = "beach";
    beach = object;
  });
}