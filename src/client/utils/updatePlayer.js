function updatePlayer(me, player) {
    const {x, y, z, angleY, angleX, angleZ, health, color, username, ship, scale} = player;
    const {camX, camHeight, camZ} = me;
    switch (ship) {
      case 0: createSmallShip(x, y, z, angleX, angleY, angleZ, color, scale); break;
      case 1: createMediumShip(x, y, z, angleX, angleY, angleZ, color, scale); break;
      case 2: createLargeShip(x, y, z, angleX, angleY, angleZ, color, scale); break;
      case 3: createWarship(x, y, z, angleX, angleY, angleZ, color, scale); break;
    }
    createHealthBar(x, y, z, health, camX, camHeight, camZ, scale);
    createLabel(x, y, z, " " + username.substring(0, username.length - 3) + " ", camX, camHeight, camZ, scale);
  }
  
  function updateChests(me, chest) {
    const {x, y, z, angle} = chest;
    createChest(x, y, z, angle);
  }