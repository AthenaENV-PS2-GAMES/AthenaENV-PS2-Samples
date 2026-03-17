function animationHorizontalSprite(params) {
    const { totalFrames, fps = 12, frameWidth, frameHeight, loop = true, image, scale = 1 } = params
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

        if (image.currentFrame >= totalFrames) {
            if (loop) {
                image.currentFrame = image.currentFrame % totalFrames;
            } else {
                image.currentFrame = totalFrames - 1;
            }
        }
    }

    image.startx = image.currentFrame * frameWidth;
    image.endx = image.currentFrame * frameWidth + frameWidth;
    image.starty = 0;
    image.endy = frameHeight;
    image.width = frameWidth * scale;
    image.height = frameHeight * scale;
}

function animationByColumns(params) {
    const { framesPerColumn, totalColumns, fps = 12, frameWidth, frameHeight, loop = true, image, scale = 1 } = params
    if (image.currentFrame === undefined) image.currentFrame = 0;
    if (image.lastUpdate === undefined) image.lastUpdate = Date.now();
    if (image.frameTimer === undefined) image.frameTimer = 0;

    const now = Date.now();
    const deltaTime = now - image.lastUpdate;
    image.lastUpdate = now;

    const frameTime = 1000 / fps;
    const totalFrames = framesPerColumn * totalColumns;

    image.frameTimer += deltaTime;

    if (image.frameTimer >= frameTime) {
        const framesToAdvance = Math.floor(image.frameTimer / frameTime);
        image.currentFrame += framesToAdvance;
        image.frameTimer -= framesToAdvance * frameTime;

        if (image.currentFrame >= totalFrames) {
            if (loop) {
                image.currentFrame = image.currentFrame % totalFrames;
            } else {
                image.currentFrame = totalFrames - 1;
            }
        }
    }

    const currentColumn = Math.floor(image.currentFrame / framesPerColumn);
    const currentRow = image.currentFrame % framesPerColumn;

    image.startx = currentColumn * frameWidth;
    image.endx = currentColumn * frameWidth + frameWidth;
    image.starty = currentRow * frameHeight;
    image.endy = currentRow * frameHeight + frameHeight;

    image.width = frameWidth * scale;
    image.height = frameHeight * scale;
}

function animationByRows(params) {
    const { framesPerRow, totalRows, scale = 1, image, frameHeight, frameWidth, fps = 12, loop = true } = params;
    if (image.currentFrame === undefined) image.currentFrame = 0;
    if (image.lastUpdate === undefined) image.lastUpdate = Date.now();
    if (image.frameTimer === undefined) image.frameTimer = 0;

    const now = Date.now();
    const deltaTime = now - image.lastUpdate;
    image.lastUpdate = now;

    const frameTime = 1000 / fps;
    const totalFrames = framesPerRow * totalRows;

    image.frameTimer += deltaTime;

    if (image.frameTimer >= frameTime) {
        const framesToAdvance = Math.floor(image.frameTimer / frameTime);
        image.currentFrame += framesToAdvance;
        image.frameTimer -= framesToAdvance * frameTime;

        if (image.currentFrame >= totalFrames) {
            if (loop) {
                image.currentFrame = image.currentFrame % totalFrames;
            } else {
                image.currentFrame = totalFrames - 1;
            }
        }
    }

    const currentRow = Math.floor(image.currentFrame / framesPerRow);
    const currentColumn = image.currentFrame % framesPerRow;

    image.startx = currentColumn * frameWidth;
    image.endx = currentColumn * frameWidth + frameWidth;
    image.starty = currentRow * frameHeight;
    image.endy = currentRow * frameHeight + frameHeight;

    image.width = frameWidth * scale;
    image.height = frameHeight * scale;
}

const ninja = new Image('./assets/ninja.png')
ninja.frameWidth = 16
ninja.frameHeight = 16
ninja.framesPerRow = 4;
ninja.totalRows = 7;
ninja.width = ninja.frameWidth;
ninja.height = ninja.frameHeight
ninja.startx = 0;
ninja.scale = 3;
ninja.endx = ninja.frameWidth;
ninja.starty = 0;
ninja.endy = ninja.frameHeight;

const tree = new Image('./assets/Tree.png')
tree.frameWidth = 192
tree.frameHeight = 192
tree.framesPerRow = 4;
tree.totalFrames = 4;
tree.width = tree.frameWidth;
tree.height = tree.frameHeight
tree.startx = 0;
tree.scale = 1;
tree.endx = tree.frameWidth;
tree.starty = 0;
tree.endy = tree.frameHeight;

const skeleton = new Image('./assets/skeleton.png')
skeleton.frameWidth = 16
skeleton.frameHeight = 16
skeleton.framesPerColumn = 7;
skeleton.totalColumns = 4;
skeleton.width = skeleton.frameWidth;
skeleton.height = skeleton.frameHeight
skeleton.startx = 0;
skeleton.scale = 3;
skeleton.endx = skeleton.frameWidth;
skeleton.starty = 0;
skeleton.endy = skeleton.frameHeight;

const font = new Font("default");

Screen.display(() => {

    font.print(0, 0, "Animated by rows");
    animationByRows({ ...ninja, image: ninja, fps: 3 })
    ninja.draw(16, 16);

    font.print(16, 84, "Animated Horizontaly");
    animationHorizontalSprite({ ...tree, image: tree, fps: 4 })
    tree.draw(16, 100);

    font.print(16, 292, "Animated by columns");
    animationByColumns({ ...skeleton, image: skeleton, fps: 4 })
    skeleton.draw(16, 312);
})