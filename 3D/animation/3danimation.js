
// get screen settings and enable depth buffer
const canvas = Screen.getMode();
canvas.zbuffering = true;
canvas.psmz = Z16S;
Screen.setMode(canvas);

// enable frame counter and vsync
Screen.setFrameCounter(true);
Screen.setVSync(false);

// set working directory to "render"
os.chdir("3DAnimation");

//Render.setView(fov, near_clip, far_clip) - Initializes rendering routines. FOV, NearClip and FarClip aren't mandatory.
Render.setView(60.0, 5.0, 4000.0);

// animation variables
let currentFrame = 0;
let frameTime = 0.0;
const animationSpeed = 0.4;

// load menu models
let menuModels = [];
for (let i = 1; i <= 31; i++) {
    menuModels.push(new RenderObject(`Menu/${i}.obj`));
    menuModels[i - 1].setPipeline(Render.PL_NO_LIGHTS);
}

// set camera position and target
const cameraPosition = { x: -3.0, y: 10.0, z: 50.0 };
const cameraTarget = { x: 0.0, y: 0.0, z: 0.0 };

Camera.position(cameraPosition.x, cameraPosition.y, cameraPosition.z);
Camera.target(cameraTarget.x, cameraTarget.y, cameraTarget.z);

// main render loop
Screen.display(() => {

    /* 
    clear screen with dark gray color
    Screen.clear(color) - Clears screen with the specified color. If you don't specify any argument, it will use black as default.
    */

    Screen.clear(Color.new(20, 20, 20));
    
    // update camera
    Camera.update();

    // handle animation timing
    frameTime += 1 / 60;
    if (frameTime >= (1.0 / animationSpeed)) {
        currentFrame++;
        frameTime = 0.0;
        if (currentFrame >= menuModels.length) {
            currentFrame = 0;
        }
    }

    // draw current frame model
    menuModels[currentFrame].draw(0.0, 0.0, 0.0, 0.0, 0.0, 0.0);
});
