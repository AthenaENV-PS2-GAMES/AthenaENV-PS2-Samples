import DustParticle from "./dustParticle.js";

const MAX_PARTICLES = 15;
const PARTICLE_SPAWN_RATE = 4;

const dustParticles = [];

const createDustParticles = () => {
    for (let i = 0; i < PARTICLE_SPAWN_RATE; i++) {
        if (dustParticles.length >= MAX_PARTICLES) break;


        const particle = new DustParticle(
            250, 250, "right"
        );

        dustParticles.push(particle);
    }
}

const updateDustParticles = () => {
    for (let i = dustParticles.length - 1; i >= 0; i--) {
        const particle = dustParticles[i];

        if (!particle.update()) {
            dustParticles.splice(i, 1);
        }
    }
}

const drawDustParticles = () => {
    dustParticles.forEach(particle => {
        particle.draw();
    });
}

Screen.setParam(Screen.DEPTH_TEST_ENABLE, false);
Screen.display(() => {
    createDustParticles();
    updateDustParticles();
    drawDustParticles();
})