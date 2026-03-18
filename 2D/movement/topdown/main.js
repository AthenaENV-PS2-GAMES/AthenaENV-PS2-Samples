import Gamepad from "./lib/gamepad.js";
import Sheep from "./sheep.js";

const sheep = new Sheep();

Screen.setParam(Screen.DEPTH_TEST_ENABLE, false);
Screen.display(() => {
    Gamepad.update();
    sheep.update();
})