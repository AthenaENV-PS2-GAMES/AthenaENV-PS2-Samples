import BaseScreen from "./baseScreen.js";
const font = new Font("default");
export default class Screen2 extends BaseScreen {
    constructor() {
        super()
        this.pads = Pads.get()
    }

    render() {
        this.pads.update();
        font.print(0, 0, "Press X to back to Screen1");

        if (this.pads.pressed(Pads.CROSS)) {
            this.screenManager.changeScreen("screen1")
        }
    }
}