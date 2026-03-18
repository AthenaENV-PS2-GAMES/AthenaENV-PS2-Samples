import Gamepad from "./lib/gamepad.js";
import Soldier from "./soldier.js";

const soldier = new Soldier();

Screen.setParam(Screen.DEPTH_TEST_ENABLE, false);
Screen.display(() => {
    Gamepad.update();

    soldier.update();
})
