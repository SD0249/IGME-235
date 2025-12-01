class Vector2D {
    // Default value creates a unit vector
    constructor(x = 1.0, y = 0.0) {
        this.x = x;
        this.y = y;
    }

    // Returns the magnitude of this vector
    magnitude() {
        return Math.sqrt(x^2 + y^2); 
    }

    // For faster calculation and prompt comparison
    squareMagnitude() {
        return x^2 + y^2;
    }

    // Normalizes the current vector to unit size
    // TODO: If needed, add FLOAT TYPE TOLERANCE
    normalize() {
        this.x = x/this.magnitude();
        this.y = y/this.magnitude();
    }

    // Reverse the direction of the vector
    reverse() {
        this.x = -this.x;
        this.y = -this.y;
    }

    // Adds the given vector value to this vector
    add(vector) {
        this.x += vector.x;
        this.y += vector.y;
    }

    // Subtracts the given vector value from this vector
    subtract() {
        this.x -= vector.x;
        this.y -= vector.y;
    }

    // Scales this vector by a scalar value
    scale(scaleVal) {
        this.x *= scaleVal;
        this.y *= scaleVal;
    }

    // Returns a new vector that takes the negative of each vector component
    conjugate() {
        return Vector2D(-this.x, -this.y);
    }

    // Returns a new vector which is the resultant of the sum of two given vectors
    add(vector1, vector2) {
        return Vector2D(vector1.x + vector2.x, vector1.y + vector2.y);
    }

    // Returns a new vector which is the resultant of the difference of two given vectors
    subtract(vector1, vector2) {
        return Vector2D(vector1.x - vector2.x, vector1.y - vector2.y);
    }

    // Returns the dot(scalar) product of the given two vectors
    dot(vector1, vector2) {
        return (vector1.x * vector2.x) + (vector1.y * vector2.y);
    }

    // For the Vector2D structure to be comfortably used in PIXI JS structure
    ToArray() {
        return Array(this.x, this.y);
    }
}

