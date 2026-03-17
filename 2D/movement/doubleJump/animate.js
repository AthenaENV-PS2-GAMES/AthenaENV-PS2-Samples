export function animationHorizontalSprite(params) {
    const { fps = 12, image, loop = true, scale = 1 } = params
    if (image.currentFrame === undefined) image.currentFrame = 0;
    if (image.lastUpdate === undefined) image.lastUpdate = Date.now();
    if (image.frameTimer === undefined) image.frameTimer = 0;

    const now = Date.now();
    const deltaTime = now - image.lastUpdate;
    image.lastUpdate = now;

    const frameTime = 1000 / fps;

    image.frameTimer += deltaTime;

    if (image.frameTimer >= frameTime) {
        const framesToAdvance = Math.floor(image.frameTimer / frameTime);
        image.currentFrame += framesToAdvance;

        image.frameTimer -= framesToAdvance * frameTime;

        if (image.currentFrame >= image.totalFrames) {
            if (loop) {
                image.currentFrame = image.currentFrame % image.totalFrames;
            } else {
                image.currentFrame = image.totalFrames - 1;
            }
        }
    }

    image.startx = image.currentFrame * image.frameWidth;
    image.endx = image.currentFrame * image.frameWidth + image.frameWidth;
    image.starty = 0;
    image.endy = image.frameHeight;
    image.width = image.frameWidth * scale;
    image.height = image.frameHeight * scale;
}