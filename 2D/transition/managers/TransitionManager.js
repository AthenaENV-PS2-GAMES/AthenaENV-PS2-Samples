export default class TransitionManager {
    constructor() {
        this.transitionImage = new Image(`./assets/Transition.png`);

        this.isTransitioning = false;
        this.transitionProgress = 0;
        this.transitionSpeed = 0.0083;
        this.columnWidth = 44;

        const screenMode = Screen.getMode();
        this.screenWidth = screenMode.width;
        this.screenHeight = screenMode.height;
        this.totalColumns = Math.ceil(this.screenWidth / this.columnWidth);

        this.onTransitionComplete = null;
        this.targetScreen = null;
        this.currentScreen = null;

        this.transitionPhase = 0;
        this.tileWidth = 44;
        this.tileHeight = 44;
        this.tilesY = Math.ceil(this.screenHeight / this.tileHeight);

        this.maxScale = 3;
        this.minScale = 0.3;
        this.scaleRange = this.maxScale - this.minScale;

        this.imageProps = {
            startx: 0,
            endx: 0,
            starty: 0,
            endy: 0,
            width: 0,
            height: 0
        };

        this.halfTileWidth = this.tileWidth * 0.5;
        this.halfTileHeight = this.tileHeight * 0.5;
        this.invTotalColumns = 1 / Math.max(1, this.totalColumns - 1);
    }

    startTransition(fromScreen, toScreen, callback = null) {
        if (this.isTransitioning) return false;

        this.currentScreen = fromScreen;
        this.targetScreen = toScreen;
        this.onTransitionComplete = callback;
        this.isTransitioning = true;
        this.transitionProgress = 0;
        this.transitionPhase = 0;

        return true;
    }

    update() {
        if (!this.isTransitioning) return;

        this.transitionProgress = Math.min(1, this.transitionProgress + this.transitionSpeed);

        if (this.transitionPhase === 0 && this.transitionProgress >= 0.5) {
            this.transitionPhase = 1;
        }

        if (this.transitionProgress === 1) {
            this._completeTransition();
        }
    }

    render() {
        if (!this.isTransitioning) return;

        if (this.transitionPhase === 0) {
            this.currentScreen?.render();
            this._renderTransitionEffect(Math.min(1, this.transitionProgress * 2), false);
        } else {
            this.targetScreen?.render();
            this._renderTransitionEffect(Math.min(1, (this.transitionProgress - 0.5) * 2), true);
        }
    }

    _renderTransitionEffect(phaseProgress, isFadeIn) {
        const progressMultiplier = phaseProgress * 1.5;

        for (let col = 0; col < this.totalColumns; col++) {
            const columnX = col * this.columnWidth;
            const columnRelativePosition = col * this.invTotalColumns;

            const adjustedProgress = Math.max(0, progressMultiplier - columnRelativePosition * 0.5);
            const columnProgress = isFadeIn ?
                Math.max(0, 1 - Math.min(1, adjustedProgress)) :
                Math.min(1, adjustedProgress);

            if (columnProgress <= 0) continue;

            const t = columnProgress;
            const easedProgress = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) * 0.5;

            const scale = this.minScale + this.scaleRange * easedProgress;
            this._renderColumn(columnX, scale, easedProgress);
        }
    }

    _renderColumn(columnX, scale, columnProgress) {
        const columnWidth = Math.min(this.columnWidth, this.screenWidth - columnX);
        const tilesInColumn = Math.ceil(columnWidth / this.tileWidth);
        const scaledTileWidth = this.tileWidth * scale;
        const scaledTileHeight = this.tileHeight * scale;

        for (let tileY = 0; tileY < this.tilesY; tileY++) {
            const y = tileY * this.tileHeight;
            const remainingHeight = Math.min(this.tileHeight, this.screenHeight - y);

            for (let tileIdx = 0; tileIdx < tilesInColumn; tileIdx++) {
                const tileX = columnX + (tileIdx * this.tileWidth);

                if (tileX >= columnX + columnWidth) break;

                const remainingWidth = Math.min(this.tileWidth, (columnX + columnWidth) - tileX);

                this._renderTile(
                    tileX, y,
                    remainingWidth, remainingHeight,
                    scaledTileWidth, scaledTileHeight,
                    columnProgress
                );
            }
        }
    }

    _renderTile(x, y, width, height, scaledWidth, scaledHeight, progress) {
        if (progress <= 0.01) return;

        const centerX = x + this.halfTileWidth;
        const centerY = y + this.halfTileHeight;
        const drawX = centerX - scaledWidth * 0.5;
        const drawY = centerY - scaledHeight * 0.5;

        const props = this.imageProps;
        props.startx = 0;
        props.starty = 0;

        if (width < this.tileWidth || height < this.tileHeight) {
            const widthRatio = Math.min(1, width / this.tileWidth);
            const heightRatio = Math.min(1, height / this.tileHeight);

            props.endx = this.tileWidth * widthRatio;
            props.endy = this.tileHeight * heightRatio;
            props.width = scaledWidth * widthRatio;
            props.height = scaledHeight * heightRatio;
        } else {
            props.endx = this.tileWidth;
            props.endy = this.tileHeight;
            props.width = scaledWidth;
            props.height = scaledHeight;
        }

        Object.assign(this.transitionImage, props);
        this.transitionImage.draw(drawX, drawY);
    }

    _completeTransition() {
        this.isTransitioning = false;
        this.transitionPhase = 0;

        this.onTransitionComplete?.();

        this.currentScreen = null;
        this.targetScreen = null;
        this.onTransitionComplete = null;
    }

    isInTransition() {
        return this.isTransitioning;
    }

    cancelTransition() {
        this.isTransitioning = false;
        this.transitionProgress = 0;
        this.transitionPhase = 0;
        this.currentScreen = null;
        this.targetScreen = null;
        this.onTransitionComplete = null;
    }

    setTransitionSpeed(speed) {
        this.transitionSpeed = Math.max(0.001, Math.min(1, speed));
    }

    setTransitionQuality(width) {
        this.columnWidth = Math.max(1, width);
        this.totalColumns = Math.ceil(this.screenWidth / this.columnWidth);
        this.invTotalColumns = 1 / Math.max(1, this.totalColumns - 1);
    }

    setScaleRange(minScale, maxScale) {
        this.minScale = Math.max(0.1, minScale);
        this.maxScale = Math.max(this.minScale, maxScale);
        this.scaleRange = this.maxScale - this.minScale;
    }

    getScaleRange() {
        return { min: this.minScale, max: this.maxScale };
    }
}