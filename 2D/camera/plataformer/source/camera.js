import { SCREEN_HEIGHT, SCREEN_WIDTH } from "../lib/constants.js";

function Camera() {
    this.x = 0;
    this.y = 0;
    this.smooth = 0.1;
    this.bounds = {
        minX: 0,
        maxX: Infinity,
        minY: 0,
        maxY: Infinity
    };
}

Camera.prototype.update = function (targetX, targetY) {
    const targetCamX = targetX - SCREEN_WIDTH / 2;
    const targetCamY = targetY - SCREEN_HEIGHT / 2;

    this.x += (targetCamX - this.x) * this.smooth;
    this.y += (targetCamY - this.y) * this.smooth;

    this.x = Math.max(this.bounds.minX, Math.min(this.bounds.maxX - SCREEN_WIDTH, this.x));
    this.y = Math.max(this.bounds.minY, Math.min(this.bounds.maxY - SCREEN_HEIGHT, this.y));
}

Camera.prototype.setBounds = function (minX, maxX, minY, maxY) {
    this.bounds = { minX, maxX, minY, maxY };
}

Camera.prototype.worldToScreen = function (worldX, worldY) {
    return {
        x: worldX - this.x,
        y: worldY - this.y
    };
}

Camera.prototype.screenToWorld = function (screenX, screenY) {
    return {
        x: screenX + this.x,
        y: screenY + this.y
    };
}

export default Camera;