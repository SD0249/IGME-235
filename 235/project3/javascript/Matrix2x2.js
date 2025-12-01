class Matrix2x2 {
    // Default constructor makes an Identity Matrix
    constructor() {
        this.e11 = 1;
        this.e12 = 0;
        this.e21 = 0;
        this.e22 = 1;
    }

    constructor(e11, e12, e21, e22) {
        this.e11 = e11;
        this.e12 = e12;
        this.e21 = e21;
        this.e22 = e22;
    }

    // Returns the determinant value of this matrix
    det() {
        return this.e11*this.e22 - this.e12*this.e21;
    }

    // Returns the transpose of this matrix
    transpose() {
        
    }
}