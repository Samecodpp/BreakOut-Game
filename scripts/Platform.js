import { Vector } from './vector.js';

class Platform {
    constructor(position, width, speed, skin) {
        this.position = position;
        this.width = width;
        this.speed = speed;
        this.skin = skin;
        this.movingLeft = false;
        this.movingRight = false;
        this.skin.style.transition = "transform 0.0s";
        this.skin.style.transform = "translateX(0%)";
        this.skin.style.transition = "transform 0.1s";
    }

    moveLeft() {
        if (this.position.x > 0) {
            const vecdir = new Vector(-1, 0);
            this.position = this.position.add(vecdir.multiply(this.speed));
        }
    }

    moveRight(containerWidth) {
        if (this.position.x + this.width < containerWidth) {
            const vecdir = new Vector(1, 0);
            this.position = this.position.add(vecdir.multiply(this.speed));
        }
    }

    draw() {
        this.skin.style.left = `${this.position.x}px`;
        this.skin.style.top = `${this.position.y}px`;
        this.skin.style.width = `${this.width}px`;
    }
}

export { Platform };