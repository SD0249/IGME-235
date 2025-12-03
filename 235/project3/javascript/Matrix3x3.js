class Matrix3x3 {
    constructor(e11 = 1.0, e12 = 0.0, e13 = 0.0, 
                e21 = 0.0, e22 = 1.0, e23 = 0.0, 
                e31 = 0.0, e32 = 0.0, e33 = 1.0) {
        this.e11 = e11;
        this.e12 = e12;
        this.e13 = e13;
        this.e21 = e21;
        this.e22 = e22;
        this.e23 = e23;
        this.e31 = e31;
        this.e32 = e32;
        this.e33 = e33;
    }

    // Returns the determinant of this matrix
    det() {
        return this.e11*this.e22*this.e33 - 
               this.e11*this.e23*this.e32 - 
               this.e12*this.e21*this.e33 + 
               this.e12*this.e23*this.e31 + 
               this.e13*this.e21*this.e32 - 
               this.e13*this.e22*this.e31;
    }

    // Returns a transpose of this matrix
    transpose() {
        return new Matrix3x3(this.e11, this.e21, this.e31, 
                             this.e12, this.e22, this.e32, 
                             this.e13, this.e23, this.e33 );
    }

    // Returns the inverse of this matrix
    inverse() {
        let determinant = det();

        if(determinant === 0) undefined;

        return new Matrix3x3((this.e22*this.e33 - this.e23*this.e32)/determinant,
                             (this.e21*this.e33 - this.e23*this.e31)/determinant,
                             (this.e21*this.e32 - this.e22*this.e31)/determinant,
                             (this.e12*this.e33 - this.e13*this.e32)/determinant,
                             (this.e11*this.e33 - this.e13*this.e31)/determinant,
                             (this.e11*this.e32 - this.e12*this.e31)/determinant,
                             (this.e12*this.e23 - this.e13*this.e22)/determinant,
                             (this.e11*this.e23 - this.e13*this.e21)/determinant,
                             (this.e11*this.e22 - this.e12*this.e21)/determinant  );
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
        (scaleVal*this.e11, scaleVal*this.e12, scaleVal*this.e13, 
         scaleVal*this.e21, scaleVal*this.e22, scaleVal*this.e23, 
         scaleVal*this.e31, scaleVal*this.e32, scaleVal*this.e33);
    }

    // Matrix Multiplication
    multiplyMatrix(matrix) {
        return new Matrix3x3();
    }

    // Vector Multiplication 
    multiplyVector(vector) {

    }


}