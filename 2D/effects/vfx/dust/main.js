import DustParticle from "./dustParticle.js";

const MAX_PARTICLES = 15;
const PARTICLE_SPAWN_RATE = 4;
const GROUND_POSITION = 397 - 40;
const JUMP_STRENGTH = 6;
const GRAVITY = 0.5;
const MAX_Y_VELOCITY = 5;
const SPEED = 2;

const background = new Image('./assets/background/background.png')

const character = new Image('./assets/characters/character1.png')
character.position = {
    x: 250,
    y: GROUND_POSITION
};
character.velocity = {
    x: 0,
    y: 0
}

const dustParticles = [];
const pads = Pads.get();

const createDustParticles = () => {
    const isMoving = Math.abs(character.velocity.x) > 0.0 || pads.pressed(Pads.LEFT) || pads.pressed(Pads.RIGHT);
    const isOnGround = character.position.y >= GROUND_POSITION;

    if (isMoving && isOnGround && dustParticles.length < MAX_PARTICLES) {
        const movingRight = pads.pressed(Pads.RIGHT) || character.velocity.x > 0;
        const movingLeft = pads.pressed(Pads.LEFT) || character.velocity.x < 0;

        let direction = 'right';
        if (movingRight) direction = 'right';
        if (movingLeft) direction = 'left';

        const spawnSide = direction === 'right' ? 'left' : 'right';

        for (let i = 0; i < PARTICLE_SPAWN_RATE; i++) {
            if (dustParticles.length >= MAX_PARTICLES) break;

            const offsetX = spawnSide === 'right' ?
                (Math.random() * 8 + 3) :
                (Math.random() * -8 - 12);

            const offsetY = Math.random() * -5 - 2;

            const particle = new DustParticle(
                character.position.x + (character.width || 32.0) * 0.5 + offsetX,
                character.position.y + (character.height || 32.0) + offsetY,
                spawnSide
            );

            dustParticles.push(particle);
        }
    }
}

const updateDustParticles = () => {
    for (let i = dustParticles.length - 1; i >= 0; i--) {
        const particle = dustParticles[i];

        if (!particle.update()) {
            dustParticles.splice(i, 1);
        }
    }
}

const drawDustParticles = () => {
    dustParticles.forEach(particle => {
        particle.draw();
    });
}

const jump = () => {
    if (character.position.y >= GROUND_POSITION) {
        character.velocity.y = JUMP_STRENGTH * -1;
    }
}

const updatePosition = () => {
    character.position = {
        x: character.position.x + character.velocity.x,
        y: character.position.y + character.velocity.y
    }
}

const applyGravity = () => {
    if (character.position.y < GROUND_POSITION) {
        character.velocity.y += GRAVITY;
    }
}

const resetVelocityWhenGrounded = () => {
    if (character.position.y >= GROUND_POSITION) {
        character.position.y = GROUND_POSITION;
        character.velocity.y = 0;
    }
}

const blockVelocity = () => {
    if (character.velocity.y > MAX_Y_VELOCITY) {
        character.velocity.y = MAX_Y_VELOCITY;
    }
}

function handleInput() {
    if (pads.pressed(Pads.RIGHT)) {
        character.position.x = character.position.x + SPEED
    }

    if (pads.pressed(Pads.LEFT)) {
        character.position.x = character.position.x - SPEED;
    }

    if (pads.justPressed(Pads.UP)) {
        jump()
    }
}

Screen.setParam(Screen.DEPTH_TEST_ENABLE, false);
Screen.display(() => {
    background.draw(0, 0)

    pads.update();

    applyGravity();
    blockVelocity();
    handleInput();
    updatePosition();
    resetVelocityWhenGrounded();
    createDustParticles();
    updateDustParticles();
    drawDustParticles();

    character.draw(character.position.x, character.position.y);
})