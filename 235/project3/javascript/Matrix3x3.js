class Matrix3x3 {
    constructor(elements = [1, 0, 0, 0, 1, 0, 0, 0, 1]) {
        this.e11 = elements[0];
        this.e12 = elements[1];
        this.e13 = elements[2];
        this.e21 = elements[3];
        this.e22 = elements[4];
        this.e23 = elements[5];
        this.e31 = elements[6];
        this.e32 = elements[7];
        this.e33 = elements[8];
    }

    // Returns the determinant of this matrix
    det() {
        return this.e11 * this.e22 * this.e33 -
            this.e11 * this.e23 * this.e32 -
            this.e12 * this.e21 * this.e33 +
            this.e12 * this.e23 * this.e31 +
            this.e13 * this.e21 * this.e32 -
            this.e13 * this.e22 * this.e31;
    }

    // Returns a transpose of this matrix
    transpose() {
        return new Matrix3x3(this.e11, this.e21, this.e31,
            this.e12, this.e22, this.e32,
            this.e13, this.e23, this.e33);
    }

    // Returns the inverse of this matrix
    inverse() {
        let determinant = this.det();

        if (determinant === 0) return undefined;

        return new Matrix3x3((this.e22 * this.e33 - this.e23 * this.e32) / determinant,
            (this.e13 * this.e32 - this.e12 * this.e33) / determinant,
            (this.e12 * this.e23 - this.e13 * this.e22) / determinant,
            (this.e23 * this.e31 - this.e21 * this.e33) / determinant,
            (this.e11 * this.e33 - this.e13 * this.e31) / determinant,
            (this.e13 * this.e21 - this.e11 * this.e23) / determinant,
            (this.e21 * this.e32 - this.e22 * this.e31) / determinant,
            (this.e12 * this.e31 - this.e11 * this.e32) / determinant,
            (this.e11 * this.e22 - this.e12 * this.e21) / determinant);
    };

    // Returns the resultant matrix - sum of given matrices
    add(A, B) {
        return new Matrix3x3
            (A.e11 + B.e11, A.e12 + B.e12, A.e13 + B.e13,
                A.e21 + B.e21, A.e22 + B.e22, A.e23 + B.e23,
                A.e31 + B.e31, A.e32 + B.e32, A.e33 + B.e33);
    }

    // Returns the resultant matrix - difference of given matrices
    subtract(A, B) {
        return new Matrix3x3
            (A.e11 - B.e11, A.e12 - B.e12, A.e13 - B.e13,
                A.e21 - B.e21, A.e22 - B.e22, A.e23 - B.e23,
                A.e31 - B.e31, A.e32 - B.e32, A.e33 - B.e33);
    }

    // Returns the scaled result of this matrix
    scale(scaleVal) {
        return new Matrix3x3
            (scaleVal * this.e11, scaleVal * this.e12, scaleVal * this.e13,
                scaleVal * this.e21, scaleVal * this.e22, scaleVal * this.e23,
                scaleVal * this.e31, scaleVal * this.e32, scaleVal * this.e33);
    }

    // Matrix Multiplication
    multiplyMatrix(matrix) {
        return new Matrix3x3(this.e11 * matrix.e11 + this.e12 * matrix.e21 + this.e13 * matrix.e31,
            this.e11 * matrix.e12 + this.e12 * matrix.e22 + this.e13 * matrix.e32,
            this.e11 * matrix.e13 + this.e12 * matrix.e23 + this.e13 * matrix.e33,
            this.e21 * matrix.e11 + this.e22 * matrix.e21 + this.e23 * matrix.e31,
            this.e21 * matrix.e12 + this.e22 * matrix.e22 + this.e23 * matrix.e32,
            this.e21 * matrix.e13 + this.e22 * matrix.e23 + this.e23 * matrix.e33,
            this.e31 * matrix.e11 + this.e32 * matrix.e21 + this.e33 * matrix.e31,
            this.e31 * matrix.e12 + this.e32 * matrix.e22 + this.e33 * matrix.e32,
            this.e31 * matrix.e13 + this.e32 * matrix.e23 + this.e33 * matrix.e33);
    }

    // Vector Multiplication with this matrix
    multiplyVector(vector) {
        let homogenuousCoordinate = [this.e11 * vector.x + this.e12 * vector.y + this.e13,
        this.e21 * vector.x + this.e22 * vector.y + this.e23,
        this.e31 * vector.x + this.e32 * vector.y + this.e33];

        return new Vector2D(homogenuousCoordinate[0] / homogenuousCoordinate[2],
            homogenuousCoordinate[1] / homogenuousCoordinate[2]);
    }

}