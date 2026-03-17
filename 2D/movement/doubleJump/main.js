const GROUND_POSITION = 250;
const JUMP_STRENGTH = 8;
const GRAVITY = 0.5;
const MAX_Y_VELOCITY = 10;

const pads = Pads.get();
let jumpsRemaining = 2;

const idle = new Image('./assets/warrior.png')
idle.width = 96;
idle.height = 96;
idle.startx = 0;
idle.endx = 96;
idle.starty = 0;
idle.endy = 96;
idle.totalFrames = 6;
idle.frameWidth = 96;
idle.frameHeight = 96;
idle.position = {
    x: 250,
    y: GROUND_POSITION
}
idle.velocity = {
    x: 0,
    y: 0
}

const jump = () => {
    if (idle.position.y >= GROUND_POSITION) {
        idle.velocity.y = JUMP_STRENGTH * -1;
        jumpsRemaining--;
    }
}

const updatePosition = () => {
    idle.position = {
        x: idle.position.x + idle.velocity.x,
        y: idle.position.y + idle.velocity.y
    }
}

const applyGravity = () => {
    if (idle.position.y < GROUND_POSITION) {
        idle.velocity.y += GRAVITY;
    }
}

const resetVelocityWhenGrounded = () => {
    if (idle.position.y >= GROUND_POSITION) {
        idle.position.y = GROUND_POSITION;
        idle.velocity.y = 0;
        jumpsRemaining = 2;
    }
}

const blockVelocity = () => {
    if (idle.velocity.y > MAX_Y_VELOCITY) {
        idle.velocity.y = MAX_Y_VELOCITY;
    }
}

Screen.display(() => {
    pads.update();

    if (pads.justPressed(Pads.CROSS)) {
        jump();
    }

    applyGravity();

    blockVelocity();

    updatePosition();

    resetVelocityWhenGrounded();


    idle.draw(idle.position.x, idle.position.y);
})