
import Assets from "./source/assets.js";
import Camera from "./source/camera.js";
import { FLOOR_Y, MAP_TILES, SCREEN_WIDTH, TILE_SIZE } from './source/constants.js'
import Player from "./source/player.js";

const tiles = Assets.image('./assets/tilemap.png')
tiles.width = 32;
tiles.height = 32;
tiles.startx = 0;
tiles.starty = 0;
tiles.endx = 32;
tiles.endy = 32;

function drawFloor(cam) {
    const leftWorld = cam.screenToWorld(0, 0).x;
    const rightWorld = cam.screenToWorld(SCREEN_WIDTH, 0).x;

    let first = Math.max(0, Math.floor(leftWorld / TILE_SIZE) - 1);
    let last = Math.min(MAP_TILES - 1, Math.floor(rightWorld / TILE_SIZE) + 1);

    for (let i = first; i <= last; i++) {
        const wx = i * TILE_SIZE;
        const p = cam.worldToScreen(wx, FLOOR_Y);

        if (i === last) {
            tiles.startx = TILE_SIZE * 2
            tiles.endx = TILE_SIZE * 3
            tiles.draw(p.x, p.y);
            continue;
        }

        if (i === first) {
            tiles.startx = 0
            tiles.endx = TILE_SIZE
            tiles.draw(p.x, p.y);
            continue;
        }

        tiles.startx = 32;
        tiles.starty = 0;
        tiles.endx = 64;
        tiles.endy = 32;
        tiles.draw(p.x, p.y);
    }
}

const cam = new Camera();
const player = new Player();
const pad = Pads.get();

Screen.setParam(Screen.DEPTH_TEST_ENABLE, false);
Screen.display(() => {
    pad.update();
    player.update(pad);
    cam.update(player.x + player.sprite.width / 2, player.y + player.sprite.height / 2);

    drawFloor(cam);
    player.draw(cam);
});