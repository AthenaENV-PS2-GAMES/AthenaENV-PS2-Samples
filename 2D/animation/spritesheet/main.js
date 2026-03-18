import { animationSprite } from "./lib/animation.js";
import Assets from "./lib/assets.js";

const ninja = Assets.image('./assets/ninja.png')
ninja.frameWidth = 16
ninja.frameHeight = 16
ninja.framesPerRow = 4;
ninja.totalFrames = 28;
ninja.width = ninja.frameWidth;
ninja.height = ninja.frameHeight
ninja.scale = 3;
ninja.startx = 0;
ninja.endx = ninja.frameWidth;
ninja.starty = 0;
ninja.endy = ninja.frameHeight;
ninja.fps = 4;

Screen.setParam(Screen.DEPTH_TEST_ENABLE, false);
Screen.display(() => {
    animationSprite(ninja)
    ninja.draw(16, 16);
})