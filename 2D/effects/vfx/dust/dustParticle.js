const dust = new Image('./assets/objects/dust.png')

export default class DustParticle {
    constructor(x, y, direction) {
        this.x = x;
        this.y = y;
        this.initialX = x;
        this.initialY = y;

        const directionMultiplier = direction === 'right' ? 1 : -1;

        this.velocityX = (Math.random() * 0.8 + 0.2) * directionMultiplier * 1.5;
        this.velocityY = (Math.random() - 0.7) * 2.0;

        this.life = 1.0;
        this.maxLife = Math.random() * 20.0 + 20.0;
        this.currentLife = 0.0;

        this.rotation = Math.random() * Math.PI * 2.0;
        this.rotationSpeed = (Math.random() - 0.5) * 0.2;

        this.initialSize = Math.random() * 4 + 2;
        this.size = this.initialSize;
        this.maxSize = this.initialSize * 3;
    }

    update() {
        this.x += this.velocityX;
        this.y += this.velocityY;

        this.velocityX *= 0.92;
        this.velocityY *= 0.96;

        this.currentLife++;
        this.life = 1.0 - (this.currentLife / this.maxLife);

        this.size = this.initialSize + (this.maxSize - this.initialSize) * (1 - this.life);

        this.rotation += this.rotationSpeed;

        return this.life > 0.0;
    }

    draw() {
        if (this.life <= 0.0) return;

        const originalWidth = dust.width;
        const originalHeight = dust.height;
        const originalColor = dust.color;

        dust.width = this.size;
        dust.height = this.size;

        const alpha = Math.floor(this.life * 100.0);
        dust.color = Color.new(255, 255, 255, alpha);

        dust.draw(this.x - (dust.width * 0.5), this.y - (dust.height * 0.5));

        dust.width = originalWidth;
        dust.height = originalHeight;
        dust.color = originalColor;
    }
}
