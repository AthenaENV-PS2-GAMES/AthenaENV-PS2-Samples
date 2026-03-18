function animationSprite(image) {
    const {
        totalFrames,
        fps = 12,
        frameWidth,
        frameHeight,
        loop = true,
        scale = 1,
        startFrame = 0,
        endFrame = totalFrames - 1,
        facingLeft = false,
        facingUp = false,
        onAnimationEnd,
        framesPerRow,
    } = image;

    if (image.currentFrame === undefined) image.currentFrame = startFrame;
    if (image.frameTimer === undefined) image.frameTimer = 0;
    if (image.lastUpdate === undefined) image.lastUpdate = Date.now();

    const now = Date.now();
    let deltaTime;

    if (image.deltaTime !== undefined) {
        deltaTime = image.deltaTime * 1000;
    } else {
        deltaTime = now - image.lastUpdate;
    }

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
                onAnimationEnd?.();
            }
        }
    }

    const frameIndex = image.currentFrame;

    image.width = frameWidth * scale;
    image.height = frameHeight * scale;

    const row = framesPerRow ? Math.floor(frameIndex / framesPerRow) : 0;
    const col = framesPerRow ? frameIndex % framesPerRow : frameIndex;

    image.startx = facingLeft ? (col + 1) * frameWidth : col * frameWidth
    image.endx = facingLeft ? col * frameWidth : image.startx + frameWidth

    image.starty = facingUp ? (row + 1) * frameHeight  : row * frameHeight;
    image.endy = facingUp ? row * frameHeight : image.starty + frameHeight;
}

function setAnimation(image, name, loop = true) {
    const anim = image.animations[name];
    if (!anim) return;
    
    if (image.currentAnimation === name) return;
    
    image.currentAnimation = name;
    image.startFrame = anim.start;
    image.endFrame = anim.end;
    image.currentFrame = anim.start;
    image.loop = loop;
    image.frameTimer = 0;
}

function animateWithEasing(frame, targetProps, progressFunction, duration = 2000) {
    if (!frame.start) frame.start = Date.now();
    if (!frame.duration) frame.duration = duration;
    if (!frame.extraDelay) frame.extraDelay = 800;
    if (!frame.loopEnabled) frame.loopEnabled = false;
    if (!frame.shouldReverse) frame.shouldReverse = false;
    if (frame.isReversed === undefined) frame.isReversed = false;

    if (!frame._deltas) {
        frame._base = {};
        frame._deltas = {};

        for (const k in targetProps) {
            frame._base[k] = frame[k] ?? 0;
            frame._deltas[k] = targetProps[k] - frame._base[k];
        }
    }

    const now = Date.now();
    const elapsed = now - frame.start;
    let t = elapsed / frame.duration;

    if (t >= 1) {
        t = 1;
        if (elapsed >= frame.duration + frame.extraDelay) {
            if (frame.loopEnabled) {
                if (frame.shouldReverse) {
                    frame.isReversed = !frame.isReversed;
                    for (const k in frame._deltas) {
                        frame._deltas[k] *= -1;
                        frame._base[k] += frame._deltas[k];
                    }
                }
                frame.start = Date.now();
                t = 0;
            }
        }
    }

    const p = progressFunction(t);
    for (const k in frame._deltas) {
        frame[k] = frame._base[k] + frame._deltas[k] * p;
    }

    return t >= 1 && !frame.loopEnabled;
}

export {
    animationSprite,
    setAnimation,
    animateWithEasing
}