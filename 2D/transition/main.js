import ScreenManager from "./managers/ScreenManager.js";
import Screen1 from "./screens/screen1.js";
import Screen2 from "./screens/screen2.js";

const screenManager = new ScreenManager();
const screen1 = new Screen1();
const screen2 = new Screen2();

screen1.setScreenManager(screenManager);
screen2.setScreenManager(screenManager);

screenManager.registerScreen("screen1", screen1);
screenManager.registerScreen("screen2", screen2);

screenManager.changeScreen("screen1");

Screen.display(() => {
    screenManager.update();
    screenManager.render();
});