import { SCREEN_HEIGHT, SCREEN_WIDTH, WORLD_RIGHT_LIMIT } from "./constants.js";

export default class Camera {
    constructor() { this.x = 0; this.y = 0; this.smooth = 0.15; }

    update(targetX, targetY) {
        this.x += (targetX - this.x) * this.smooth;
        this.y += (targetY - this.y) * this.smooth
        const halfWidth = SCREEN_WIDTH / 2;

        if (this.x < halfWidth) this.x = halfWidth;
        if (this.x > WORLD_RIGHT_LIMIT - halfWidth) this.x = WORLD_RIGHT_LIMIT - halfWidth;
    }

    worldToScreen(worldX, worldY) {
        return { x: worldX - this.x + SCREEN_WIDTH / 2, y: worldY - this.y + SCREEN_HEIGHT / 2 };
    }

    screenToWorld(screenX) {
        return { x: screenX + this.x - SCREEN_WIDTH / 2 };
    }
}
