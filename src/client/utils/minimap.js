const canvas = document.getElementById('minimap');

export function createMinimap() {
    const ctx = canvas.getContext('2d');
    ctx.canvas.width = 250;
    ctx.canvas.height = 250;
    canvas.style.zIndex = 10;
    canvas.style.position = "absolute;";
    canvas.style.marginLeft = "50%;"

    return ctx;
}

export function clearMinimap(ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "rgba(47, 206, 36, 0.5)";
    ctx.beginPath();
    ctx.roundRect(20, 20, 220, 220, 15);
    ctx.stroke();
    ctx.fill();

    ctx.fillStyle = "rgba(0, 7, 230, 1)";
    ctx.beginPath();
    ctx.roundRect(25, 25, 210, 210, 15);
    ctx.stroke();
    ctx.fill();
}

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

export function updateMinimap(ctx, ship, isMe) {
    const convertedScale = ship.scale * 4;
    const convertedX = (ship.x + 1000)/10.0 + 30 - convertedScale/2.0;
    const convertedZ = (ship.z + 1000)/10.0 + 30 - convertedScale/2.0;

    if (isMe) {
        // ctx.fillStyle = "rgba(" + Math.floor(Math.random() * 255) + ", " + Math.floor(Math.random() * 255) + ", " + Math.floor(Math.random() * 255) + ")";
        // ctx.beginPath();
        // ctx.roundRect(convertedX-1, convertedZ-1, convertedScale+2, convertedScale+2, (convertedScale+2)/2);
        // ctx.stroke();
        // ctx.fill();
    }

    const color = hexToRgb(ship.color);
    ctx.fillStyle = "rgba(" + color.r + ", " + color.g + ", " + color.b + ", 1)";
    ctx.beginPath();
    ctx.roundRect(convertedX, convertedZ, convertedScale, convertedScale, convertedScale/2);
    ctx.stroke();
    ctx.fill();
}
