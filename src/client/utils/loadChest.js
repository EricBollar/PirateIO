var chest = [];
export function loadChest() {
  var loader = new OBJLoader();
	loader.load( '/assets/OBJ/SM_Prop_Chest_Lid_03.obj', function ( object ) {
    object.name = "lid";
    chest.push(object);
  });
  loader.load( '/assets/OBJ/SM_Prop_Chest_03.obj', function ( object ) {
    object.name = "chest";
    chest.push(object);
  });
}