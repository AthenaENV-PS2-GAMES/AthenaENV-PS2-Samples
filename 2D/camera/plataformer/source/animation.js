export function animationHorizontalSprite(image) {
    const {
        totalFrames,
        fps = 12,
        frameWidth,
        frameHeight,
        loop = true,
        scale = 1,
        startFrame = 0,
        endFrame = totalFrames - 1,
        facingLeft = false
    } = image;

    if (image.currentFrame === undefined) image.currentFrame = startFrame;
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

        if (image.currentFrame > endFrame) {
            if (loop) {
                image.currentFrame = startFrame + ((image.currentFrame - startFrame) % (endFrame - startFrame + 1));
            } else {
                image.currentFrame = endFrame;
            }
        }
    }

    const frameIndex = image.currentFrame;
    image.startx = frameIndex * frameWidth;
    image.endx = image.startx + frameWidth;
    image.starty = 0;
    image.endy = frameHeight;
    image.width = Math.abs(frameWidth * scale) * (facingLeft ? -1 : 1);
    image.height = frameHeight * scale;
}