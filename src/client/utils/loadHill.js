var hill = [];
export function loadHill() {
    var loader = new OBJLoader();
        loader.load( '/assets/OBJ/SM_Env_Background_Hills_01.obj', function ( object ) {
        object.name = "beach";
        hill = object;
    });
}