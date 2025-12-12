// Converts angle degree value to radians
function degreesToRadians(degrees) {
    return degrees * (Math.PI / 180);
}

// Parses the given element(text or number) to number values
function parseElementValue(valueString, elementId) {
    const value = valueString.trim().toLowerCase();

    // 1. Get for degree notation (For Rotation)
    if (value.endsWith('d')) {
        const degrees = parseFloat(value.slice(0, -1));
        const radianVal = degreesToRadians(degrees);

        // Calculate the correct trigonometric value based on element position
        if (elementId === 'e11_input' || elementId === 'e22_input') {
            return Math.cos(radianVal);
        }

        if (elementId === 'e12_input') {
            return -Math.sin(radianVal);
        }

        if (elementId === 'e21_input') {
            return Math.sin(radianVal);
        }
    }

    // 2. If not, default to Pure Number value (For Scaling, Shearing, Translation)
    const num = parseFloat(value);
    return Number.isNaN(num) ? 0 : num;
}

// When apply button is clicked
function handleApply() {
    // 1. Collect element and IDs in order (Row Major)
    const elementIds = [
        'e11_input', 'e12_input', 'e13_input',
        'e21_input', 'e22_input', 'e23_input',
        'e31_input', 'e32_input', 'e33_input'
    ];

    let elements = elementIds.map(id => {
        const inputElement = document.getElementById(id);
        const value = inputElement.value;
        return parseElementValue(value, id);
    });

    // 2. Create the new Input Matrix
    elements[2] *= gridSpacing;         // Translation X, Y values need to be scaled by grid spacing
    elements[5] *= gridSpacing;
    const M_input = new Matrix3x3(elements);
    backwardStack.Push(M_input);

    // 3. Stack the Transformation
    currentTotalMatrix = M_input.multiplyMatrix(currentTotalMatrix);

    // 4. Update UI and visualization
    UpdateVisualization();
    UpdateDeterminantDisplay();
    UpdateMatrixTotalDisplay();
    ResetInputMatrix(elementIds);

    // 5. Update previous total matrix
    previousTotalMatrix = currentTotalMatrix.copy();
}

// Draws the current total transformation applied
function UpdateVisualization() {
    DrawVisualization();
};

// Displays the current scale factor (determinant)
function UpdateDeterminantDisplay() {
    const determinant = currentTotalMatrix.det();
    if(Number.isNaN(determinant)) return 0;

    // Check if the determinant element exists
    const detElement = document.getElementById('determinantValue');
    if(detElement) {
        detElement.textContent = determinant.toFixed(3);
    }
};

// Displays the current total matrix
function UpdateMatrixTotalDisplay() {
    document.getElementById('e11_total').value = currentTotalMatrix.e11;
    document.getElementById('e12_total').value = currentTotalMatrix.e12;
    document.getElementById('e13_total').value = currentTotalMatrix.e13 / gridSpacing;
    document.getElementById('e21_total').value = currentTotalMatrix.e21;
    document.getElementById('e22_total').value = currentTotalMatrix.e22;
    document.getElementById('e23_total').value = currentTotalMatrix.e23 / gridSpacing;
    document.getElementById('e31_total').value = currentTotalMatrix.e31;
    document.getElementById('e32_total').value = currentTotalMatrix.e32;
    document.getElementById('e33_total').value = currentTotalMatrix.e33;
};

// Resets the input field after user applies
function ResetInputMatrix(elementIds) {
    // Reset the input fields to the identity matrix values
    document.getElementById('e11_input').value = '1';
    document.getElementById('e22_input').value = '1';
    document.getElementById('e33_input').value = '1';

    elementIds.forEach(id => {
        if(id !== 'e11_input' && id !== 'e22_input' && id !== 'e33_input') {
            document.getElementById(id).value = '0';
        }
    });
};

// Resets all of the necessary components for the tool to work
function Reset() {
    // Reset the current and the previous total matrix
    currentTotalMatrix.identity();
    previousTotalMatrix.identity();

    // Empty forward and backward stack
    backwardStack.Empty();
    forwardStack.Empty();

    // Update determinant value and the total transformation matrix displayed
    UpdateDeterminantDisplay();
    UpdateMatrixTotalDisplay();
    UpdateVisualization();
}

// Clicking the undo button, 
// the shape is transformed back to the previous transformation.
function Undo() {
    // Check whether undo action can be performed
    if(backwardStack.isEmpty()) return;

    // 1. Pop the latest matrix from backwardStack and push it to forwardStack
    forwardStack.Push(backwardStack.Pop());
    
    // 2. Recomput the current total matrix by multiplying all matrices in the backwardstack
    currentTotalMatrix.identity();

    // Create a temporary array of all matrices currently in the stack
    const remainingMatrices = backwardStack.toArray();

    // Multiply them in order
    for(let i = 0; i < remainingMatrices.length; i++) {
        currentTotalMatrix = remainingMatrices[i].multiplyMatrix(currentTotalMatrix);
    }

    // 3. Update previousTotalMatrix
    previousTotalMatrix.identity();

    for(let i = 0; i < remainingMatrices.length - 1; i++) {
        previousTotalMatrix = remainingMatrices[i].multiplyMatrix(previousTotalMatrix);
    }

    // 4. Update displays
    UpdateDeterminantDisplay();
    UpdateMatrixTotalDisplay();
    UpdateVisualization();
}

// Clicking the redo button,
// the shape is transformed back to where it was before clicking undo
function Redo() {
    // Check whether redo action can be performed
    if(forwardStack.isEmpty()) return;

    // TODO: Fix Undo()
    // Re-apply the transformation on top of the forward stack &
    // update current total matrix
    previousTotalMatrix = backwardStack.Peek().multiplyMatrix(previousTotalMatrix);
    backwardStack.Push(forwardStack.Pop());
    currentTotalMatrix = backwardStack.Peek().multiplyMatrix(currentTotalMatrix);
    
    // Update Displays
    UpdateDeterminantDisplay();
    UpdateMatrixTotalDisplay();
    UpdateVisualization();
}

// Attach handler to the Apply button
document.getElementById('applyButton').addEventListener('click', handleApply);

// Attach handler to reset button
document.getElementById('resetButton').addEventListener('click', Reset);

// Attach handler to Undo button
document.getElementById('undoButton').addEventListener('click', Undo);

// Attach handler to Redo button
document.getElementById('redoButton').addEventListener('click', Redo);
