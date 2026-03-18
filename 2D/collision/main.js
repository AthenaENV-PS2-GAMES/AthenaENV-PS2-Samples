import Collision from "./lib/collision.js";
import Gamepad from "./lib/gamepad.js";

const SCREEN_WIDTH = 640;
const SCREEN_HEIGHT = 448;
const PLAYER_SIZE = 32;
const OBSTACLE_SIZE = 64;
const PLAYER_SPEED = 3.0f;

const COLOR_PLAYER = Color.new(0, 150, 255, 128);
const COLOR_PLAYER_HIT = Color.new(255, 50, 50, 128);
const COLOR_OBSTACLE = Color.new(100, 255, 100, 128);
const COLOR_GROUND = Color.new(80, 80, 80, 128);
const COLOR_DEBUG = Color.new(255, 255, 0, 200);

const player = {
    x: 100.0f,
    y: 300.0f,
    w: PLAYER_SIZE,
    h: PLAYER_SIZE,
    vx: 0.0f,
    vy: 0.0f,
    colliderId: null,
    isColliding: false
};

const obstacle = {
    x: 300.0f,
    y: 250.0f,
    w: OBSTACLE_SIZE,
    h: OBSTACLE_SIZE,
    colliderId: null
};

const ground = {
    x: 0.0f,
    y: 400.0f,
    w: SCREEN_WIDTH,
    h: 48.0f,
    colliderId: null
};

function initColliders() {
    player.colliderId = Collision.register({
        type: 'rect',
        x: player.x,
        y: player.y,
        w: player.w,
        h: player.h,
        static: false,
        layer: 'player',
        mask: ['obstacle', 'ground'],
        tags: ['controllable'],
        onCollision: function(other) {
            player.isColliding = true;
        }
    });

    obstacle.colliderId = Collision.register({
        type: 'rect',
        x: obstacle.x,
        y: obstacle.y,
        w: obstacle.w,
        h: obstacle.h,
        static: true,
        layer: 'obstacle',
        mask: ['player'],
        tags: ['solid']
    });

    ground.colliderId = Collision.register({
        type: 'rect',
        x: ground.x,
        y: ground.y,
        w: ground.w,
        h: ground.h,
        static: true,
        layer: 'ground',
        mask: ['player'],
        tags: ['solid', 'ground']
    });
}

function updatePlayerInput() {
    const pad = Gamepad.player(0);

    player.vx = 0.0f;
    player.vy = 0.0f;

    if (pad.pressed(Pads.RIGHT)) {
        player.vx = PLAYER_SPEED;
    } else if (pad.pressed(Pads.LEFT)) {
        player.vx = -PLAYER_SPEED;
    }

    if (pad.pressed(Pads.DOWN)) {
        player.vy = PLAYER_SPEED;
    } else if (pad.pressed(Pads.UP)) {
        player.vy = -PLAYER_SPEED;
    }

    const leftStick = pad.leftStick();
    if (Math.abs(leftStick.x) > 0.2f) {
        player.vx = leftStick.x * PLAYER_SPEED;
    }
    if (Math.abs(leftStick.y) > 0.2f) {
        player.vy = leftStick.y * PLAYER_SPEED;
    }
}

function updatePlayerMovement() {
    player.isColliding = false;

    if (player.vx !== 0.0f) {
        player.x += player.vx;

        Collision.update(player.colliderId, { x: player.x });

        const hits = Collision.checkOne(player.colliderId);
        for (const hit of hits) {
            if (hit.tags.includes('solid')) {
                const playerCol = Collision.get(player.colliderId);
                const otherCol = hit.collider;

                if (player.vx > 0) {
                    player.x = otherCol.x - player.w;
                } else {
                    player.x = otherCol.x + otherCol.w;
                }
                player.vx = 0.0f;
                Collision.update(player.colliderId, { x: player.x });
            }
        }
    }

    if (player.vy !== 0.0f) {
        player.y += player.vy;

        Collision.update(player.colliderId, { y: player.y });

        const hits = Collision.checkOne(player.colliderId);
        for (const hit of hits) {
            if (hit.tags.includes('solid')) {
                const otherCol = hit.collider;

                if (player.vy > 0) {
                    player.y = otherCol.y - player.h;
                } else {
                    player.y = otherCol.y + otherCol.h;
                }
                player.vy = 0.0f;
                Collision.update(player.colliderId, { y: player.y });
            }
        }
    }

    if (player.x < 0) player.x = 0;
    if (player.x + player.w > SCREEN_WIDTH) player.x = SCREEN_WIDTH - player.w;
    if (player.y < 0) player.y = 0;
    if (player.y + player.h > SCREEN_HEIGHT) player.y = SCREEN_HEIGHT - player.h;

    Collision.update(player.colliderId, { 
        x: player.x, 
        y: player.y 
    });
}

function render() {
    Screen.clear();

    Draw.rect(ground.x, ground.y, ground.w, ground.h, COLOR_GROUND);

    Draw.rect(obstacle.x, obstacle.y, obstacle.w, obstacle.h, COLOR_OBSTACLE);

    Draw.line(obstacle.x, obstacle.y, obstacle.x + obstacle.w, obstacle.y, COLOR_DEBUG);
    Draw.line(obstacle.x + obstacle.w, obstacle.y, obstacle.x + obstacle.w, obstacle.y + obstacle.h, COLOR_DEBUG);
    Draw.line(obstacle.x + obstacle.w, obstacle.y + obstacle.h, obstacle.x, obstacle.y + obstacle.h, COLOR_DEBUG);
    Draw.line(obstacle.x, obstacle.y + obstacle.h, obstacle.x, obstacle.y, COLOR_DEBUG);

    const playerColor = player.isColliding ? COLOR_PLAYER_HIT : COLOR_PLAYER;
    Draw.rect(player.x, player.y, player.w, player.h, playerColor);

    const borderColor = player.isColliding ? Color.new(255, 0, 0, 255) : Color.new(0, 200, 255, 255);
    Draw.line(player.x, player.y, player.x + player.w, player.y, borderColor);
    Draw.line(player.x + player.w, player.y, player.x + player.w, player.y + player.h, borderColor);
    Draw.line(player.x + player.w, player.y + player.h, player.x, player.y + player.h, borderColor);
    Draw.line(player.x, player.y + player.h, player.x, player.y, borderColor);

    if (player.isColliding) {
        Draw.line(player.x, player.y, player.x + player.w, player.y + player.h, Color.new(255, 0, 0, 255));
        Draw.line(player.x + player.w, player.y, player.x, player.y + player.h, Color.new(255, 0, 0, 255));
    }

    Collision.renderDebug(0, 0);
}

Screen.setParam(Screen.DEPTH_TEST_ENABLE, false);
initColliders();

Screen.display(() => {
    Gamepad.update();

    updatePlayerInput();

    updatePlayerMovement();

    Collision.check();

    render();
});