function simpleParallaxToDown(image, parallaxOptions, speed) {
    if (parallaxOptions.backgroundsY[1] === 0) {
        parallaxOptions.backgroundsY[1] = parallaxOptions.screenHeight;
    }

    if (parallaxOptions.lastUpdate === undefined) parallaxOptions.lastUpdate = Date.now();

    const now = Date.now();
    const deltaTime = now - parallaxOptions.lastUpdate;
    parallaxOptions.lastUpdate = now;

    for (let i = 0; i < 2; i++) {
        parallaxOptions.backgroundsY[i] += speed * (deltaTime / 1000);
        if (parallaxOptions.backgroundsY[i] >= parallaxOptions.screenHeight) {
            parallaxOptions.backgroundsY[i] -= 2 * parallaxOptions.screenHeight;
        }
    }

    image.draw(0, parallaxOptions.backgroundsY[0]);
    image.draw(0, parallaxOptions.backgroundsY[1]);
}

const image = new Image('./assets/bg.png')

const parallaxOptions = {
    backgroundsY: [0, Screen.getMode().height],
    screenHeight: Screen.getMode().height
};

Screen.display(() => {
    simpleParallaxToDown(image, parallaxOptions, 24);
});
