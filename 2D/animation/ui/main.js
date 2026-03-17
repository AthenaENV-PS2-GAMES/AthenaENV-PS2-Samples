import Easing from "./easing.js";

const white = Color.new(255, 255, 255);

class Square {
    startPos;
    endPos;
    position;
    textPos;

    constructor(startPos, endPos, textPos) {
        this.startPos = startPos;
        this.endPos = endPos;
        this.position = { ...startPos };
        this.textPos = textPos;
    }
}

const font = new Font();
font.scale = Math.fround(0.5);

let start = Date.now();
let duration = 2000;
let extraDelay = 800;

function animate(square, progressFunction) {
    let now = Date.now();
    let elapsed = now - start;
    let t = elapsed / duration;

    if (t >= 1) {
        if (elapsed >= duration + extraDelay) {
            start = Date.now();
            t = 0;
        } else {
            t = 1;
        }
    }

    let progress = progressFunction(t);

    square.position.x = square.startPos.x + (square.endPos.x - square.startPos.x) * progress;
    square.position.y = square.startPos.y + (square.endPos.y - square.startPos.y) * progress;
}

// Below you can see a simple function to execute an animation with easing, without delay or loop
// function animate(square, progressFunction) {
//     let now = Date.now();
//     let t = (now - start) / duration;
//     if (t > 1) t = 1;

//     let progress = progressFunction(t);

//     square.position.x = square.startPos.x + (square.endPos.x - square.startPos.x) * progress;
//     square.position.y = square.startPos.y + (square.endPos.y - square.startPos.y) * progress;
// }

const examples = [
    ["Linear", Easing.linear],
    ["EaseInQuad", Easing.easeInQuad],
    ["EaseOutQuad", Easing.easeOutQuad],
    ["EaseInOutQuad", Easing.easeInOutQuad],
    ["EaseInCubic", Easing.easeInCubic],
    ["EaseOutCubic", Easing.easeOutCubic],
    ["EaseInOutCubic", Easing.easeInOutCubic],
    ["EaseInQuart", Easing.easeInQuart],
    ["EaseOutQuart", Easing.easeOutQuart],
    ["EaseInOutQuart", Easing.easeInOutQuart],
    ["EaseInQuint", Easing.easeInQuint],
    ["EaseOutQuint", Easing.easeOutQuint],
    ["EaseInOutQuint", Easing.easeInOutQuint],
    ["EaseInSine", Easing.easeInSine],
    ["EaseOutSine", Easing.easeOutSine],
    ["EaseInOutSine", Easing.easeInOutSine],
    ["EaseInExpo", Easing.easeInExpo],
    ["EaseOutExpo", Easing.easeOutExpo],
    ["EaseInOutExpo", Easing.easeInOutExpo],
    ["EaseInCirc", Easing.easeInCirc],
    ["EaseOutCirc", Easing.easeOutCirc],
    ["EaseInOutCirc", Easing.easeInOutCirc],
    ["EaseInBack", Easing.easeInBack],
    ["EaseOutBack", Easing.easeOutBack],
    ["EaseInOutBack", Easing.easeInOutBack],
    ["EaseOutElastic", Easing.easeOutElastic],
    ["EaseOutBounce", Easing.easeOutBounce]
];

let y = 20;
const squares = examples.map(([name, fn]) => {
    let sq = new Square(
        { x: 20, y },
        { x: 200, y },
        { x: 220, y }
    );
    sq.fn = fn;
    sq.label = name;
    y += 15;
    return sq;
});

Screen.display(() => {
    for (let square of squares) {
        animate(square, square.fn);
        font.print(square.textPos.x, square.textPos.y, square.label);
        Draw.rect(square.position.x, square.position.y, 10, 10, white);
    }
});
