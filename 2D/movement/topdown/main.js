const pads = Pads.get();
const moveSpeed = 1;
const image = new Image('./assets/sheep.png')
image.frameWidth = 128;
image.frameHeight = 128;
image.totalRows = 2;
image.width = image.frameWidth;
image.height = image.frameHeight;
image.startx = 0;
image.starty = 0;
image.scale = 1;
image.endx = image.width;
image.endy = image.height;
image.currentRow = 0;
image.flipX = false;
image.framesPerRow = 8;
image.position = {
    x: 0,
    y: 0
}

function moveAnimation() {
    image.currentRow = 1;
    image.framesPerRow = 6;
}

function handleInput() {
    let moveX = 0;
    let moveY = 0;
    let isMoving = false;

    if (pads.pressed(Pads.RIGHT)) {
        moveX += 1;
        image.flipX = false;
        isMoving = true;
    }

    if (pads.pressed(Pads.LEFT)) {
        moveX -= 1;
        image.flipX = true;
        isMoving = true;
    }

    if (pads.pressed(Pads.UP)) {
        moveY -= 1;
        isMoving = true;
    }

    if (pads.pressed(Pads.DOWN)) {
        moveY += 1;
        isMoving = true;
    }

    if (isMoving) {
        moveAnimation();

        const length = Math.sqrt(moveX * moveX + moveY * moveY);
        if (length > 0) {
            moveX = (moveX / length) * moveSpeed;
            moveY = (moveY / length) * moveSpeed;
        }

        image.position.x += moveX;
        image.position.y += moveY;
    }
}

function animationByRows(params) {
    const { image, fps = 12, loop } = params;
    if (image.currentFrame === undefined) image.currentFrame = 0;
    if (image.currentRow === undefined) image.currentRow = 0;
    if (image.lastUpdate === undefined) image.lastUpdate = Date.now();
    if (image.frameTimer === undefined) image.frameTimer = 0;

    const now = Date.now();
    const deltaTime = now - image.lastUpdate;
    image.lastUpdate = now;

    const frameTime = 1000 / fps;
    const totalFrames = image.framesPerRow * image.totalRows;

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

    const currentColumn = image.currentFrame % image.framesPerRow;

    image.startx = currentColumn * image.frameWidth;
    image.endx = currentColumn * image.frameWidth + image.frameWidth;
    image.starty = image.currentRow * image.frameHeight;
    image.endy = image.currentRow * image.frameHeight + image.frameHeight;

    image.width = image.flipX ? -Math.abs(image.frameWidth * image.scale) : Math.abs(image.frameWidth * image.scale);
    image.height = image.frameHeight * image.scale;
}

function handleXPosition() {
    return image.flipX ? image.position.x + (image.frameWidth * image.scale) : image.position.x
}

Screen.display(() => {
    pads.update();

    handleInput();

    animationByRows({ image, loop: true });

    image.draw(handleXPosition(), image.position.y);
    image.currentRow = 0;
    image.framesPerRow = 8;
})