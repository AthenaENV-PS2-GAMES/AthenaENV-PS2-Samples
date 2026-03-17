export default class BaseScreen {
    constructor() {
        this.screenManager = null;
    }


    setScreenManager(manager) {
        this.screenManager = manager;
    }

    onEnter() {

    }

    onExit() { }
}