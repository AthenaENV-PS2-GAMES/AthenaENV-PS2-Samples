import { animationSprite, setAnimation } from "./lib/animation.js";
import Assets from "./lib/assets.js";
import { PLAYER_ONE_PORT } from "./lib/constants.js";
import Gamepad from "./lib/gamepad.js";

function Sheep() {
    this.speed = 2;
    this.spriteSheet = Assets.image('./assets/sheep.png')

    this.ANIMATIONS = {
        IDLE: "idle",
        WALK: "walk"
    }

    this._initAnimation();
}

Sheep.prototype._initAnimation = function () {
    this.spriteSheet.frameWidth = 128;
    this.spriteSheet.frameHeight = 128;

    this.spriteSheet.scale = 1;
    this.spriteSheet.facingLeft = false;

    this.spriteSheet.totalFrames = 14;
    this.spriteSheet.currentRow = 0;
    this.spriteSheet.framesPerRow = 8;

    this.spriteSheet.position = {
        x: 0,
        y: 0
    }

    this.spriteSheet.animations = {
        [this.ANIMATIONS.IDLE]: {
            start: 0,
            end: 7
        },
        [this.ANIMATIONS.WALK]: {
            start: 8,
            end: 13
        }
    }

    setAnimation(this.spriteSheet, this.ANIMATIONS.IDLE)
}

Sheep.prototype.handleInput = function () {
    let moveX = 0;
    let moveY = 0;
    let isMoving = false;

    if (Gamepad.player(PLAYER_ONE_PORT).pressed(Pads.RIGHT)) {
        moveX += 1;
        this.spriteSheet.facingLeft = false;
        isMoving = true;
    }

    if (Gamepad.player(PLAYER_ONE_PORT).pressed(Pads.LEFT)) {
        moveX -= 1;
        this.spriteSheet.facingLeft = true;
        isMoving = true;
    }

    if (Gamepad.player(PLAYER_ONE_PORT).pressed(Pads.UP)) {
        moveY -= 1;
        isMoving = true;
    }

    if (Gamepad.player(PLAYER_ONE_PORT).pressed(Pads.DOWN)) {
        moveY += 1;
        isMoving = true;
    }

    if (isMoving) {
        setAnimation(this.spriteSheet, this.ANIMATIONS.WALK)

        const length = Math.sqrt(moveX * moveX + moveY * moveY);

        if (length > 0) {
            moveX = (moveX / length) * this.speed;
            moveY = (moveY / length) * this.speed;
        }

        this.spriteSheet.position.x += moveX;
        this.spriteSheet.position.y += moveY;

    }
    else{
        setAnimation(this.spriteSheet, this.ANIMATIONS.IDLE)
    }
}

Sheep.prototype.update = function () {
    this.handleInput();

    animationSprite(this.spriteSheet);
    this.spriteSheet.draw(this.spriteSheet.position.x, this.spriteSheet.position.y);
}

export default Sheep;