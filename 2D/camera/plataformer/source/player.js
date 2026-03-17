import { animationHorizontalSprite } from "./animation.js";
import Assets from "./assets.js";
import { FLOOR_Y, SCREEN_WIDTH, WORLD_LEFT_LIMIT, WORLD_RIGHT_LIMIT } from './constants.js'

export default class Player {
    constructor() {
        this.speed = 4;
        this.velocityY = 0;
        this.isGrounded = true;

        this.JUMP_STRENGTH = 8;
        this.GRAVITY = 0.5;
        this.MAX_Y_VELOCITY = 10;

        this.sprite = Assets.image('./assets/character.png')
        this.sprite.width = 48;
        this.sprite.height = 48;
        this.sprite.startx = 0;
        this.sprite.endx = 48;
        this.sprite.starty = 0;
        this.sprite.endy = 48;
        this.sprite.totalFrames = 6;
        this.sprite.frameWidth = this.sprite.width;
        this.sprite.frameHeight = this.sprite.height;
        this.sprite.facingLeft = false;

        this.state = 'idle';

        this.x = SCREEN_WIDTH / 2 - this.sprite.width / 2;
        this.y = FLOOR_Y - this.sprite.height;
    }

    update(pad) {
        this.state = 'idle';
        let dx = 0;

        if (pad.pressed(Pads.LEFT)) {
            dx = -this.speed;
            this.state = 'run';
            this.sprite.facingLeft = true;
        }
        if (pad.pressed(Pads.RIGHT)) {
            dx = this.speed;
            this.state = 'run';
            this.sprite.facingLeft = false;
        }

        if (pad.pressed(Pads.CROSS) && this.isGrounded) {
            this.velocityY = -this.JUMP_STRENGTH;
            this.isGrounded = false;
        }

        if (!this.isGrounded) {
            this.velocityY += this.GRAVITY;

            if (this.velocityY > this.MAX_Y_VELOCITY) {
                this.velocityY = this.MAX_Y_VELOCITY;
            }
        }

        this.x += dx;
        this.y += this.velocityY;

        if (this.y >= FLOOR_Y - this.sprite.height) {
            this.y = FLOOR_Y - this.sprite.height;
            this.velocityY = 0;
            this.isGrounded = true;
        }

        if (this.x < WORLD_LEFT_LIMIT) this.x = WORLD_LEFT_LIMIT;
        if (this.x + this.sprite.width > WORLD_RIGHT_LIMIT) this.x = WORLD_RIGHT_LIMIT - this.sprite.width;
    }

    draw(cam) {
        const position = cam.worldToScreen(this.x, this.y);

        if (this.state === 'run') animationHorizontalSprite(this.sprite);
        if (this.state === 'idle') this.sprite.currentFrame = 5;

        const drawX = this.sprite.facingLeft ? position.x + Math.abs(this.sprite.width) : position.x;
        this.sprite.draw(drawX, position.y);
    }
}