import Assets from "../lib/assets.js";
import Gamepad from "../lib/gamepad.js"
import { animationSprite, setAnimation } from "../lib/animation.js"
import { FLOOR_Y, PLAYER_ONE_PORT, SCREEN_WIDTH, WORLD_LEFT_LIMIT, WORLD_RIGHT_LIMIT } from '../lib/constants.js'

function Player() {
    this.speed = 4;
    this.velocityY = 0;
    this.isGrounded = true;

    this.JUMP_STRENGTH = 8;
    this.GRAVITY = 0.5;
    this.MAX_Y_VELOCITY = 10;

    this.sprite = Assets.image('./assets/character.png')
    this._initAnimation();

    this.sprite.x = SCREEN_WIDTH / 2 - this.sprite.width / 2;
    this.sprite.y = FLOOR_Y - this.sprite.height;

    this.dx = 0;
}

Player.prototype._initAnimation = function () {
    this.sprite.width = 48;
    this.sprite.height = 48;

    this.sprite.frameWidth = this.sprite.width;
    this.sprite.frameHeight = this.sprite.height;

    this.sprite.totalFrames = 6;
    this.sprite.framesPerRow = 6;

    this.sprite.facingLeft = false;

    this.sprite.animations = {
        IDLE: {
            start: 5,
            end: 5
        },
        RUN: {
            start: 0,
            end: 4
        }
    }
}

Player.prototype.applyGravity = function () {
    this.velocityY += this.GRAVITY;

    if (this.velocityY > this.MAX_Y_VELOCITY) {
        this.velocityY = this.MAX_Y_VELOCITY;
    }
}

Player.prototype.updatePosition = function () {
    this.sprite.x += this.dx;
    this.sprite.y += this.velocityY;

    if (this.sprite.y >= FLOOR_Y - this.sprite.height) {
        this.sprite.y = FLOOR_Y - this.sprite.height;
        this.velocityY = 0;
        this.isGrounded = true;
    }

    if (this.sprite.x < WORLD_LEFT_LIMIT) this.sprite.x = WORLD_LEFT_LIMIT;
    if (this.sprite.x + this.sprite.width > WORLD_RIGHT_LIMIT) this.sprite.x = WORLD_RIGHT_LIMIT - this.sprite.width;
}

Player.prototype.handleInput = function () {
    this.isMoving = false;
    this.dx = 0;

    if (Gamepad.player(PLAYER_ONE_PORT).pressed(Pads.LEFT)) {
        this.dx = -this.speed;
        this.sprite.facingLeft = true;
        this.isMoving = true;
    }
    if (Gamepad.player(PLAYER_ONE_PORT).pressed(Pads.RIGHT)) {
        this.dx = this.speed;
        this.sprite.facingLeft = false;
        this.isMoving = true;
    }
    if (Gamepad.player(PLAYER_ONE_PORT).justPressed(Pads.CROSS) && this.isGrounded) {
        this.velocityY = -this.JUMP_STRENGTH;
        this.isGrounded = false;
    }

    this.isMoving 
        ? setAnimation(this.sprite, 'RUN') 
        : setAnimation(this.sprite, 'IDLE');
    
}

Player.prototype.update = function () {
    this.handleInput();

    if (!this.isGrounded) this.applyGravity();

    this.updatePosition();
}

Player.prototype.draw = function (cameraX = 0, cameraY = 0) {
    const screenX = this.sprite.x - cameraX;
    const screenY = this.sprite.y - cameraY;

    animationSprite(this.sprite)
    this.sprite.draw(
        screenX,
        screenY
    );
}

export default Player;