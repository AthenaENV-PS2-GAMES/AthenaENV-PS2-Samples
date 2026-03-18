import Assets from "./lib/assets.js";
import Gamepad from "./lib/gamepad.js";
import { DEFAULT_JUMPS, GRAVITY, GROUND_POSITION, JUMP_STRENGTH, MAX_Y_VELOCITY, PLAYER_ONE_PORT } from "./lib/constants.js";

function Soldier() {
    this.spritesheet = Assets.image('./assets/warrior.png');

    this._initSpritesheet();

    this.jumpsRemaining = DEFAULT_JUMPS || 2;
}

Soldier.prototype._initSpritesheet = function () {
    this.spritesheet.width = 96;
    this.spritesheet.height = 96;
    this.spritesheet.startx = 0;
    this.spritesheet.endx = 96;
    this.spritesheet.starty = 0;
    this.spritesheet.endy = 96;
    this.spritesheet.position = {
        x: 250,
        y: GROUND_POSITION
    }
    this.spritesheet.velocity = {
        x: 0,
        y: 0
    }
}

Soldier.prototype.jump = function () {
    if (this.jumpsRemaining === 0) return;
    
    this.spritesheet.velocity.y = JUMP_STRENGTH * -1;
    this.jumpsRemaining--;
}

Soldier.prototype.updatePosition = function () {
    this.spritesheet.position = {
        x: this.spritesheet.position.x + this.spritesheet.velocity.x,
        y: this.spritesheet.position.y + this.spritesheet.velocity.y
    }
}

Soldier.prototype.applyGravity = function () {
    this.spritesheet.velocity.y += GRAVITY;
};

Soldier.prototype.resetVelocityWhenGrounded = function () {
    if (this.spritesheet.position.y >= GROUND_POSITION) {
        this.spritesheet.position.y = GROUND_POSITION;
        this.spritesheet.velocity.y = 0;
        this.jumpsRemaining = DEFAULT_JUMPS || 2;
    }
}

Soldier.prototype.blockVelocity = function () {
    if (this.spritesheet.velocity.y > MAX_Y_VELOCITY) {
        this.spritesheet.velocity.y = MAX_Y_VELOCITY;
    }
}

Soldier.prototype.update = function () {
    if (Gamepad.player(PLAYER_ONE_PORT).justPressed(Pads.CROSS)) this.jump();

    this.applyGravity();
    this.blockVelocity();
    this.updatePosition();
    this.resetVelocityWhenGrounded();

    this.spritesheet.draw(this.spritesheet.position.x, this.spritesheet.position.y)
}

export default Soldier;