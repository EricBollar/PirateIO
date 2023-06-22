export class Minimap {
    constructor() {
        this.canvas = document.getElementById('minimap');
        this.ctx = this.canvas.getContext('2d');
        this.ctx.canvas.width = 250;
        this.ctx.canvas.height = 250;
        // this.canvas.style.zIndex = 10;
        // this.canvas.style.position = "absolute;";
        // this.canvas.style.marginLeft = "50%;"
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.fillStyle = "rgba(47, 206, 36, 0.5)";
        this.ctx.beginPath();
        this.ctx.roundRect(20, 20, 220, 220, 15);
        this.ctx.stroke();
        this.ctx.fill();

        this.ctx.fillStyle = "rgba(0, 7, 230, 1)";
        this.ctx.beginPath();
        this.ctx.roundRect(25, 25, 210, 210, 15);
        this.ctx.stroke();
        this.ctx.fill();
    }

    update(x, z, scale, color) {
        const convertedScale = scale * 4;
        const convertedX = (x + 1000)/10.0 + 30 - convertedScale/2.0;
        const convertedZ = (z + 1000)/10.0 + 30 - convertedScale/2.0;
    
        const colorRGB = this.hexToRgb(color);
        this.ctx.fillStyle = "rgba(" + colorRGB.r + ", " + colorRGB.g + ", " + colorRGB.b + ", 1)";
        this.ctx.beginPath();
        this.ctx.roundRect(convertedX, convertedZ, convertedScale, convertedScale, convertedScale/2);
        this.ctx.stroke();
        this.ctx.fill();
    }

    hexToRgb(hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }
}
