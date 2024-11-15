class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    add(vector) {
        return new Vector(this.x + vector.x, this.y + vector.y);
    }
    subtract(vector) {
        return new Vector(this.x - vector.x, this.y - vector.y);
    }
    multiply(scalar) {
        return new Vector(this.x * scalar, this.y * scalar);
    }
    magnitude() {
        return Math.sqrt(this.x ** 2 + this.y ** 2);
    }
    normalize() {
        const length = this.magnitude();
        if (length === 0) {
            throw new Error('Cannot normalize a zero vector');
        }
        return new Vector(this.x / length, this.y / length);
    }
    dot(vector) {
        return this.x * vector.x + this.y * vector.y;
    }
    cross(vector) {
        return this.x * vector.y - this.y * vector.x;
    }
    angleBetween(vector) {
        const dotProduct = this.dot(vector);
        const magnitudes = this.magnitude() * vector.magnitude();
        if (magnitudes === 0) {
            throw new Error('Cannot calculate angle with zero-length vector');
        }
        return Math.acos(dotProduct / magnitudes);
    }
    equals(vector) {
        return this.x === vector.x && this.y === vector.y;
    }
}

export{Vector};