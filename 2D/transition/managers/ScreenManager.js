import TransitionManager from "./TransitionManager.js";

export default class ScreenManager {
    constructor() {
        this.screens = new Map();
        this.currentScreen = null;
        this.nextScreen = null;
        this.transitionManager = new TransitionManager();

        this.isInitialized = false;
        this.isPaused = false;
    }

    registerScreen(screenId, screenInstance) {
        this.screens.set(screenId, screenInstance);
    }

    unregisterScreen(screenId) {
        if (this.screens.has(screenId)) {
            const screen = this.screens.get(screenId);

            if (typeof screen.cleanup === 'function') {
                screen.cleanup();
            }

            this.screens.delete(screenId);
        }
    }

    changeScreen(screenId, useTransition = true, callback = null) {
        if (!this.screens.has(screenId)) {
            return false;
        }

        const targetScreen = this.screens.get(screenId);

        if (!this.transitionManager.isInTransition() && this.currentScreen !== targetScreen) {
            console.log("ENTREI ANTES")
            if (useTransition && this.currentScreen) {
                console.log("ENTREI")
                this.nextScreen = targetScreen;

                return this.transitionManager.startTransition(
                    this.currentScreen,
                    targetScreen,
                    () => {
                        this._completeScreenChange(screenId, callback);
                    }
                );
            } else {
                this._completeScreenChange(screenId, callback);
                return true;
            }
        }

        return false;
    }

    _completeScreenChange(screenId, callback) {
        const oldScreen = this.currentScreen;
        const newScreen = this.screens.get(screenId);

        if (oldScreen && typeof oldScreen.onExit === 'function') {
            oldScreen.onExit();
        }

        this.currentScreen = newScreen;
        this.nextScreen = null;

        if (this.currentScreen && typeof this.currentScreen.onEnter === 'function') {
            this.currentScreen.onEnter();
        }

        if (callback && typeof callback === 'function') {
            callback(screenId);
        }
    }

    getCurrentScreen() {
        return this.currentScreen;
    }

    getCurrentScreenId() {
        for (const [id, screen] of this.screens.entries()) {
            if (screen === this.currentScreen) {
                return id;
            }
        }
        return null;
    }

    update() {
        if (this.isPaused) return;

        this.transitionManager.update();

        if (!this.transitionManager.isInTransition() && this.currentScreen) {
            if (typeof this.currentScreen.update === 'function') {
                this.currentScreen.update();
            }
        }
    }

    render() {
        if (this.isPaused) return;

        if (this.transitionManager.isInTransition()) {
            this.transitionManager.render();
        } else if (this.currentScreen) {
            this.currentScreen.render();
        }
    }

    pause() {
        this.isPaused = true;

        if (this.currentScreen && typeof this.currentScreen.onPause === 'function') {
            this.currentScreen.onPause();
        }
    }

    resume() {
        this.isPaused = false;

        if (this.currentScreen && typeof this.currentScreen.onResume === 'function') {
            this.currentScreen.onResume();
        }
    }

    isTransitioning() {
        return this.transitionManager.isInTransition();
    }

    setTransitionSpeed(speed) {
        this.transitionManager.setTransitionSpeed(speed);
    }

    getRegisteredScreens() {
        return Array.from(this.screens.keys());
    }

    hasScreen(screenId) {
        return this.screens.has(screenId);
    }

    forceStopTransition() {
        this.transitionManager.cancelTransition();
    }

    cleanup() {
        this.transitionManager.cancelTransition();

        for (const [, screen] of this.screens.entries()) {
            if (typeof screen.cleanup === 'function') {
                screen.cleanup();
            }
        }

        this.screens.clear();
        this.currentScreen = null;
        this.nextScreen = null;
        this.isPaused = false;
    }
}